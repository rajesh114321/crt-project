const store = require('../services/store');

const getAllDepartments = (req, res) => {
  const departments = store.getDepartments();
  const tokens = store.getTokens();
  const counters = store.getCounters();

  // Attach live queue stats and real average service time to each department
  const enriched = departments.map(dept => {
    const activeTokens = tokens.filter(t => t.departmentId === dept.id && (t.status === 'WAITING' || t.status === 'CALLING'));
    const currentlyServing = tokens.find(t => t.departmentId === dept.id && t.status === 'CALLING');
    const waitingCount = activeTokens.filter(t => t.status === 'WAITING').length;
    
    // Calculate real completed records and average duration
    const completedTokens = tokens.filter(t => t.departmentId === dept.id && t.status === 'COMPLETED' && t.completedAt);
    let realAvg = null;
    if (completedTokens.length >= 3) {
      const totalSeconds = completedTokens.reduce((acc, t) => {
        const start = t.calledAt || t.createdAt;
        return acc + Math.max(15, (new Date(t.completedAt) - new Date(start)) / 1000);
      }, 0);
      realAvg = Math.max(1, Math.round((totalSeconds / completedTokens.length / 60) * 10) / 10);
    }

    const defaultAvg = Number(dept.avgServiceTimeMinutes) || 3;
    const effectiveAvg = realAvg !== null ? realAvg : defaultAvg;
    const deptActiveCounters = counters.filter(c => c.departmentId === dept.id && c.status === 'Active').length || 1;

    return {
      ...dept,
      waitingCount,
      currentlyServing: currentlyServing ? currentlyServing.tokenNumber : 'None',
      realAvg,
      completedRecords: completedTokens.length,
      isEstimate: completedTokens.length < 3,
      effectiveAvg,
      activeCounters: deptActiveCounters,
      estimatedWaitMinutes: Math.ceil((waitingCount * effectiveAvg) / deptActiveCounters)
    };
  });

  res.json({
    success: true,
    data: enriched
  });
};

const getDepartmentById = (req, res) => {
  const dept = store.getDepartmentById(req.params.id);
  if (!dept) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }
  res.json({ success: true, data: dept });
};

const updateDepartment = (req, res) => {
  const updated = store.updateDepartment(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }
  res.json({ success: true, data: updated, message: 'Department updated successfully' });
};

const createDepartment = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Department name is required' });
  }
  const created = store.addDepartment(req.body);
  res.status(201).json({ success: true, data: created, message: 'Department created successfully' });
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  createDepartment
};
