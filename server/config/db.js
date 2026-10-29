const mongoose = require('mongoose');

// Connects to MongoDB and resolves once the connection is ready. Errors are
// thrown (not exited) so that a serverless invocation can return a clean 503
// instead of killing the running function instance; the local server decides
// to exit on failure in server.js.
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelmate';
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
