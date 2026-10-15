const store = require('../services/store');

const getAnalytics = (req, res) => {
  const analytics = store.getAnalytics();
  res.json({
    success: true,
    data: analytics
  });
};

const resetDemo = (req, res) => {
  store.resetDemo();
  res.json({
    success: true,
    message: 'Demo dataset successfully reset to initial factory state.'
  });
};

module.exports = {
  getAnalytics,
  resetDemo
};
