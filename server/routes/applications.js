const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF and DOC files
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/msword' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Submit general application
router.post('/general', upload.single('resume'), async (req, res) => {
  try {
    const applicationData = {
  name: req.body.name, 
  email: req.body.email,
  phone: req.body.phone,
  linkedIn: req.body.linkedIn,
  portfolio: req.body.portfolio,
  experience: req.body.experience,
  skills: req.body.skills,
  coverLetter: req.body.coverLetter,
  preferredRole: req.body.preferredRole,
  availability: req.body.availability,
  expectedSalary: req.body.expectedSalary,
  resumeFileName: req.file ? req.file.filename : null,
};



//saving to db
    const application = new Application(applicationData);
    await application.save();


    //send response
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
});

// Get all applications (for admin)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// Get all applications by email
router.get('/by-email/:email', async (req, res) => {
  try {
    const applications = await Application.find({ email: req.params.email.toLowerCase() });
    if (!applications || applications.length === 0) {
      return res.status(404).json({ success: false, message: 'No applications found for this email.' });
    }
    res.json({ success: true, applications }); // return array, not single object
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching applications', error: error.message });
  }
});


// Then the generic route (must be last)
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching application', error: error.message });
  }
});



//delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    res.json({ success: true, message: 'Application deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting application', error: error.message });
  }
});

//updateF
router.put('/:id', upload.single('resume'), async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };
    if (req.file) {
      updates.resumeFileName = req.file.filename;
    }

    const updatedApp = await Application.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedApp) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, message: 'Application updated', application: updatedApp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
});



module.exports = router;