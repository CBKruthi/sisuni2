// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const applicationRoutes = require('./routes/applications');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Create uploads directory if it doesn't exist
// const fs = require('fs');
// const uploadsDir = 'uploads/resumes';
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Serve uploaded files
// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api/applications', applicationRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sisuni-careers', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('Connected to MongoDB');
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// })
// .catch((error) => {
//   console.error('MongoDB connection error:', error);
//   process.exit(1);
// });

// console.log()

// var x=0
// {
//   var x="krutghiu"
// }




// for the career....


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const applicationRoutes = require('./routes/applications');

// const app = express();
// const PORT = process.env.PORT || 3001;

// console.log('🟡 Initializing Express App');

// // Middleware
// app.use(cors());
// console.log('✅ CORS enabled');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// console.log('✅ Middleware configured for JSON and URL-encoded data');

// // Create uploads directory if it doesn't exist
// const fs = require('fs');
// const uploadsDir = 'uploads/resumes';
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log(`📁 Created directory: ${uploadsDir}`);
// } else {
//   console.log(`📁 Uploads directory exists: ${uploadsDir}`);
// }

// // Serve uploaded files
// app.use('/uploads', express.static('uploads'));
// console.log('📂 Serving static files from /uploads');

// // Routes
// app.use('/api/applications', applicationRoutes);
// console.log('📦 Application routes mounted at /api/applications');

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   console.log('💓 Health check called');
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// // Connect to MongoDB
// console.log('🔌 Connecting to MongoDB...');
// mongoose.connect(process.env.MONGODB_URI )
// .then(() => {
//   console.log('✅ Connected to MongoDB');
//   app.listen(PORT, () => {
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   });
// })
// .catch((error) => {
//   console.error('❌ MongoDB connection error:', error);
//   process.exit(1);
// });










// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// const applicationRoutes = require('./routes/applications');
// const contactRoutes = require('./routes/contact');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Create uploads directory
// const uploadsDir = 'uploads/resumes';
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log(`📁 Created directory: ${uploadsDir}`);
// } else {
//   console.log(`📁 Uploads directory exists: ${uploadsDir}`);
// }

// // ✅ Static files
// app.use('/uploads', express.static('uploads'));

// // ✅ Routes
// app.use('/api/applications', applicationRoutes);  // Careers
// app.use('/api/contact', contactRoutes);           // Contact Us

// // ✅ Health Check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });


// // ✅ Connect to Career MongoDB (default)
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('✅ Connected to Career MongoDB');

//     // ✅ Start server after career DB is connected
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   });

// // ✅ Connect to Contact MongoDB (separate DB)
// const { createConnection } = require('mongoose');
// const contactDB = createConnection(process.env.MONGODB_CONTACT_URI, {
//   dbName: 'contactDB',
// });
// contactDB.on('connected', () => {
//   console.log('✅ Connected to Contact MongoDB');
// });
// contactDB.on('error', (err) => {
//   console.error('❌ Contact DB connection error:', err);
// });

// module.exports = { contactDB };




const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const { mongoose } = require('./db'); // ✅ Use shared DB file
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resume upload folder check
const uploadsDir = path.join(__dirname, 'uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created uploads folder: ${uploadsDir}`);
} else {
  console.log(`📁 Uploads folder exists`);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});






