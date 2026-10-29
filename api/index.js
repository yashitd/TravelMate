require('dotenv').config();

const connectDB = require('../server/config/db');
const app = require('../server/app');

// Vercel sends every /api/* request to this single function (see the rewrite
// in vercel.json) while preserving the original path in req.url, so the normal
// Express routes (/api/auth, /api/travels, ...) keep working unchanged.
//
// Mongoose connections are cached between warm invocations, so the connection
// promise is memoised here instead of reconnecting on every request.
let connectionPromise = null;

function ensureConnection() {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((err) => {
      // Reset so the next invocation can retry instead of caching the failure.
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureConnection();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Database connection failed' }));
    return;
  }

  return app(req, res);
};
