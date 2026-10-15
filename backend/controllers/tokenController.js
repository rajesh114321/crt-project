const store = require('../services/store');

// @desc    Get all tokens (Admin)
// @route   GET /api/tokens
const getAllTokens = (req, res) => {
  const tokens = store.getTokens();
  res.json({
    success: true,
    data: tokens
  });
};

// @desc    Get tokens for logged-in student
// @route   GET /api/tokens/my-tokens
const getUserTokens = (req, res) => {
  const tokens = store.getTokensByUser(req.user.id);
  res.json({
    success: true,
    data: tokens
  });
};

// @desc    Join queue / Create Token
// @route   POST /api/tokens/join
const createToken = (req, res, next) => {
  try {
    const { departmentId, service } = req.body;

    if (!departmentId || !service) {
      return res.status(400).json({ success: false, message: 'Please select a department and service.' });
    }

    // Check if user already has an active WAITING or CALLING token
    const userTokens = store.getTokensByUser(req.user.id);
    const existingActive = userTokens.find(t => t.status === 'WAITING' || t.status === 'CALLING');
    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: `You already hold an active token (${existingActive.tokenNumber}) in ${existingActive.departmentName}. Please complete or cancel it before taking a new one.`
      });
    }

    const token = store.createToken({
      userId: req.user.id,
      studentName: req.user.name,
      studentId: req.user.studentId,
      departmentId,
      service
    });

    res.status(201).json({
      success: true,
      data: token,
      message: `Token ${token.tokenNumber} generated successfully!`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Live Queue data & student position
// @route   GET /api/tokens/live-status
const getLiveQueue = (req, res) => {
  const tokens = store.getTokens();
  const counters = store.getCounters();
  const departments = store.getDepartments();

  // Active counters with current serving token
  const counterStatuses = counters.map(c => {
    const servingToken = tokens.find(t => t.departmentId === c.departmentId && t.status === 'CALLING' && t.counter === c.counterNumber) ||
                          tokens.find(t => t.departmentId === c.departmentId && t.status === 'CALLING');
    const deptWaiting = tokens.filter(t => t.departmentId === c.departmentId && t.status === 'WAITING').length;

    return {
      counterId: c.id,
      counterNumber: c.counterNumber,
      counterName: c.name,
      departmentId: c.departmentId,
      departmentName: c.departmentName,
      status: c.status,
      staffName: c.staffName,
      currentlyServing: servingToken ? servingToken.tokenNumber : (c.currentToken || 'None'),
      waitingCount: deptWaiting
    };
  });

  // Calculate detailed student token status if logged in
  let studentStatus = null;
  if (req.user) {
    const userTokens = store.getTokensByUser(req.user.id);
    const activeToken = userTokens.find(t => t.status === 'WAITING' || t.status === 'CALLING');

    if (activeToken) {
      const dept = store.getDepartmentById(activeToken.departmentId);
      const avgMinutes = dept ? dept.avgServiceTimeMinutes : 3;

      // All tokens for this department
      const deptTokens = tokens.filter(t => t.departmentId === activeToken.departmentId);
      const currentlyServing = deptTokens.find(t => t.status === 'CALLING');

      // Waiting tokens queued before this student
      const waitingTokens = deptTokens
        .filter(t => t.status === 'WAITING')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const myIndex = waitingTokens.findIndex(t => t.id === activeToken.id);
      const peopleAhead = activeToken.status === 'CALLING' ? 0 : (myIndex >= 0 ? myIndex : 0);
      const estimatedWaitMinutes = peopleAhead * avgMinutes;

      // Construct visual pipeline
      // Show recent 2 completed/called + up to 5 waiting tokens around student
      const recentCompleted = deptTokens
        .filter(t => t.status === 'COMPLETED')
        .slice(-3);

      const queueSteps = [];
      recentCompleted.forEach(t => {
        queueSteps.push({ tokenNumber: t.tokenNumber, label: 'Served', status: 'done' });
      });

      if (currentlyServing) {
        queueSteps.push({ 
          tokenNumber: currentlyServing.tokenNumber, 
          label: currentlyServing.id === activeToken.id ? 'You (At Counter)' : 'Now Serving', 
          status: 'serving' 
        });
      }

      waitingTokens.forEach((t, idx) => {
        const isMe = t.id === activeToken.id;
        const isNext = idx === 0 && !currentlyServing;
        queueSteps.push({
          tokenNumber: t.tokenNumber,
          label: isMe ? 'You' : (idx === 0 ? 'Next' : `Position ${idx + 1}`),
          status: isMe ? 'user' : (idx === 0 ? 'next' : 'waiting')
        });
      });

      studentStatus = {
        hasActiveToken: true,
        token: activeToken,
        currentlyServing: currentlyServing ? currentlyServing.tokenNumber : 'None',
        peopleAhead,
        averageServiceTime: avgMinutes,
        estimatedWaitMinutes,
        isNearTurn: peopleAhead <= 1 || activeToken.status === 'CALLING',
        queueSteps: queueSteps.slice(-8) // keep reasonable visual length
      };
    } else {
      studentStatus = {
        hasActiveToken: false
      };
    }
  }

  res.json({
    success: true,
    data: {
      counters: counterStatuses,
      studentStatus,
      timestamp: new Date().toISOString()
    }
  });
};

// @desc    Admin: Call Next Token
// @route   POST /api/tokens/call-next
const callNext = (req, res, next) => {
  try {
    const { departmentId, counterNumber } = req.body;
    if (!departmentId) {
      return res.status(400).json({ success: false, message: 'Department ID is required' });
    }

    const nextToken = store.callNextToken({ departmentId, counterNumber: Number(counterNumber) || 1 });
    if (!nextToken) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No waiting tokens in this department queue.'
      });
    }

    res.json({
      success: true,
      data: nextToken,
      message: `Token ${nextToken.tokenNumber} is now being called to Counter ${nextToken.counter}.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Complete Token
// @route   POST /api/tokens/:id/complete
const completeToken = (req, res, next) => {
  try {
    const completed = store.completeToken(req.params.id);
    if (!completed) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    res.json({
      success: true,
      data: completed,
      message: `Token ${completed.tokenNumber} marked as completed.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Skip Token (No-Show)
// @route   POST /api/tokens/:id/skip
const skipToken = (req, res, next) => {
  try {
    const skipped = store.skipToken(req.params.id);
    if (!skipped) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    // Optionally auto-call next token if requested
    const autoNext = req.query.autoNext === 'true';
    let nextCalled = null;
    if (autoNext) {
      nextCalled = store.callNextToken({
        departmentId: skipped.departmentId,
        counterNumber: skipped.counter
      });
    }

    res.json({
      success: true,
      data: {
        skipped,
        nextCalled
      },
      message: `Token ${skipped.tokenNumber} skipped (marked No-Show). ${nextCalled ? `Calling next token ${nextCalled.tokenNumber}.` : ''}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Recall Token
// @route   POST /api/tokens/:id/recall
const recallToken = (req, res, next) => {
  try {
    const recalled = store.recallToken(req.params.id);
    if (!recalled) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    res.json({
      success: true,
      data: recalled,
      message: `Token ${recalled.tokenNumber} recalled to Counter ${recalled.counter}.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel Token (Student or Admin)
// @route   POST /api/tokens/:id/cancel
const cancelToken = (req, res, next) => {
  try {
    const isStudent = req.user.role === 'student';
    const userId = isStudent ? req.user.id : null;

    const cancelled = store.cancelToken(req.params.id, userId);
    if (!cancelled) {
      return res.status(404).json({ success: false, message: 'Token not found or unauthorized' });
    }

    res.json({
      success: true,
      data: cancelled,
      message: `Token ${cancelled.tokenNumber} has been cancelled.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search Tokens (Admin)
// @route   GET /api/tokens/search
const searchTokens = (req, res) => {
  const query = req.query.q || '';
  const results = store.searchTokens(query);
  res.json({
    success: true,
    data: results
  });
};

// @desc    Rate Token (Student)
// @route   POST /api/tokens/:id/rate
const rateToken = (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
    }
    const rated = store.rateToken(req.params.id, rating, feedback);
    if (!rated) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }
    res.json({ success: true, data: rated, message: 'Thank you for your rating!' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Service Records (Admin Reports)
// @route   GET /api/tokens/service-records
const getServiceRecords = (req, res) => {
  const records = store.getServiceRecords();
  res.json({
    success: true,
    data: records
  });
};

// @desc    Transfer Token to another Counter / Service
// @route   POST /api/tokens/:id/transfer
const transferToken = (req, res, next) => {
  try {
    const { departmentId, counterNumber, reason } = req.body;
    const transferred = store.transferToken(req.params.id, { departmentId, counterNumber, reason });
    if (!transferred) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }
    res.json({
      success: true,
      data: transferred,
      message: `Token ${transferred.tokenNumber} transferred to ${transferred.departmentName} (Counter ${transferred.counter}).`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTokens,
  getUserTokens,
  createToken,
  getLiveQueue,
  callNext,
  completeToken,
  skipToken,
  recallToken,
  cancelToken,
  transferToken,
  searchTokens,
  rateToken,
  getServiceRecords
};
