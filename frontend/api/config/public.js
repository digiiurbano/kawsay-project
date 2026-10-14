const { getTransporter } = require('../../lib/mailer');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    emailEnabled: !!getTransporter()
  });
};
