const store = require('../services/store');

const getAllCounters = (req, res) => {
  const counters = store.getCounters();
  const tokens = store.getTokens();

  // Attach live currently serving and backlog for each counter
  const enriched = counters.map(counter => {
    const queueForDept = tokens.filter(t => t.departmentId === counter.departmentId && t.status === 'WAITING');
    return {
      ...counter,
      waitingCount: queueForDept.length
    };
  });

  res.json({
    success: true,
    data: enriched
  });
};

const updateCounter = (req, res) => {
  const { id } = req.params;
  const { status, departmentId, staffName } = req.body;

  let updates = {};
  if (status) updates.status = status;
  if (staffName) updates.staffName = staffName;
  if (departmentId) {
    const dept = store.getDepartmentById(departmentId);
    if (dept) {
      updates.departmentId = dept.id;
      updates.departmentName = dept.name;
    }
  }

  const updated = store.updateCounter(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Counter not found' });
  }

  res.json({
    success: true,
    data: updated,
    message: `Counter ${updated.counterNumber} updated successfully`
  });
};

module.exports = {
  getAllCounters,
  updateCounter
};
