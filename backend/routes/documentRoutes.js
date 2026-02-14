const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, agencyOnly, adminOnly } = require('../middleware/authMiddleware');
const documentController = require('../controllers/documentController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Agency routes
router.get('/my-documents', protect, agencyOnly, documentController.getMyDocuments);
router.post('/upload', protect, agencyOnly, upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 },
  { name: 'authorizationLetter', maxCount: 1 }
]), documentController.uploadDocuments);
router.get('/check-verification', protect, agencyOnly, documentController.checkVerification);

// Admin routes
router.get('/pending', protect, adminOnly, documentController.getPendingDocuments);
router.get('/all', protect, adminOnly, documentController.getAllDocuments);
router.post('/update-status', protect, adminOnly, documentController.updateDocumentStatus);

module.exports = router;
