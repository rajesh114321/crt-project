const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Comprehensive 2FA & Settings Verification Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Healthcheck
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'online', '1. Server Healthcheck /api/health is online');

    // 2. Admin Login requires 2FA
    const loginRes = await request('POST', '/api/auth/login', {
      identifier: '24r21a6620@mlrit.ac.in',
      password: 'admin123'
    });
    assert(loginRes.status === 200 && loginRes.body.requireOtp === true, '2. Admin Login requires 2FA OTP verification');
    assert(loginRes.body.maskedEmail && loginRes.body.maskedEmail.includes('@mlrit.ac.in'), `3. Masked Email properly displayed: ${loginRes.body.maskedEmail}`);
    assert(loginRes.body.maskedPhone && loginRes.body.maskedPhone.includes('1736'), `4. Masked Phone properly displayed: ${loginRes.body.maskedPhone}`);

    const tempSessionId = loginRes.body.tempSessionId;
    const devOtp = loginRes.body.devOtp;

    // 5. Verify 2FA OTP with wrong code
    const wrongVerify = await request('POST', '/api/auth/admin/verify-otp', {
      tempSessionId,
      otp: '000000'
    });
    assert(wrongVerify.status === 400 && wrongVerify.body.code === 'INCORRECT_OTP', '5. Rejects incorrect 2FA OTP code');

    // 6. Verify 2FA OTP with correct code
    const correctVerify = await request('POST', '/api/auth/admin/verify-otp', {
      tempSessionId,
      otp: devOtp
    });
    assert(correctVerify.status === 200 && correctVerify.body.token && correctVerify.body.user.role === 'admin', '6. Verifies valid 6-digit cryptographic OTP and grants Admin JWT');
    const adminToken = correctVerify.body.token;

    // 7. Get Gateway Config Status
    const configStatus = await request('GET', '/api/auth/admin/config-status', null, adminToken);
    assert(configStatus.status === 200 && configStatus.body.gmail && configStatus.body.twilio, '7. Admin Config Status endpoint provides SMTP & Twilio diagnostic info');

    // 8. Change Password (reject wrong current password)
    const badPass = await request('POST', '/api/auth/change-password', {
      currentPassword: 'wrongpassword',
      newPassword: 'newsecurepass123'
    }, adminToken);
    assert(badPass.status === 400, '8. Change Password rejects incorrect current password');

    // 9. Change Password (successful bcrypt update)
    const goodPass = await request('POST', '/api/auth/change-password', {
      currentPassword: 'admin123',
      newPassword: 'newsecurepass123'
    }, adminToken);
    assert(goodPass.status === 200 && goodPass.body.success, '9. Change Password hashes and updates password with bcrypt');

    // 10. Revert Password back to admin123
    const revertPass = await request('POST', '/api/auth/change-password', {
      currentPassword: 'newsecurepass123',
      newPassword: 'admin123'
    }, adminToken);
    assert(revertPass.status === 200 && revertPass.body.success, '10. Reverted Password back to admin123 for repeatability');

    // 11. Request Contact Update OTP
    const reqUpdate = await request('POST', '/api/auth/admin/update-contact-request', {
      type: 'phone',
      value: '+91 8121301736'
    }, adminToken);
    assert(reqUpdate.status === 200 && reqUpdate.body.sessionId && reqUpdate.body.devOtp, '11. Contact update dispatches cryptographic OTP to new phone');

    // 12. Verify Contact Update OTP
    const verUpdate = await request('POST', '/api/auth/admin/update-contact-verify', {
      sessionId: reqUpdate.body.sessionId,
      otp: reqUpdate.body.devOtp,
      type: 'phone',
      value: '+91 8121301736'
    }, adminToken);
    assert(verUpdate.status === 200 && verUpdate.body.success, '12. Verifies Contact update OTP and updates administrator database record');

    // 13. Audit Activity Logs
    const logsRes = await request('GET', '/api/auth/admin/activity-logs', null, adminToken);
    assert(logsRes.status === 200 && Array.isArray(logsRes.body.logs) && logsRes.body.logs.length > 0, `13. Activity log audit trail returns ${logsRes.body.logs.length} logged security events`);

    console.log(`\n========================================`);
    console.log(`Results: ${passed} / ${total} tests passed!`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
