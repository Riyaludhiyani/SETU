const Document = require('../models/Document');

// Get agency's documents
exports.getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.findOne({ agency: req.user._id });
    
    if (!documents) {
      return res.json(null);
    }

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload documents
exports.uploadDocuments = async (req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Use multer to handle file uploads
    // 2. Store files in cloud storage (AWS S3, Cloudinary, etc.)
    // 3. Store file URLs in database
    
    // For now, we'll simulate the upload
    const { businessLicense, taxCertificate, authorizationLetter } = req.files || {};

    if (!businessLicense || !taxCertificate || !authorizationLetter) {
      return res.status(400).json({ message: 'All documents are required' });
    }

    // Check if documents already exist
    let documents = await Document.findOne({ agency: req.user._id });

    if (documents) {
      // Update existing documents
      documents.businessLicense = businessLicense[0].filename;
      documents.taxCertificate = taxCertificate[0].filename;
      documents.authorizationLetter = authorizationLetter[0].filename;
      documents.status = 'pending';
      documents.uploadedAt = new Date();
      documents.rejectionReason = '';
    } else {
      // Create new document record
      documents = new Document({
        agency: req.user._id,
        agencyName: req.user.name,
        agencyEmail: req.user.email,
        businessLicense: businessLicense[0].filename,
        taxCertificate: taxCertificate[0].filename,
        authorizationLetter: authorizationLetter[0].filename,
        status: 'pending'
      });
    }

    await documents.save();

    res.json({ message: 'Documents uploaded successfully', documents });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pending documents (Admin only)
exports.getPendingDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ status: 'pending' }).sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching pending documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all documents (Admin only)
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or reject documents (Admin only)
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { documentId, status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const documents = await Document.findById(documentId);

    if (!documents) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    documents.status = status;
    documents.reviewedAt = new Date();
    documents.reviewedBy = req.user._id;
    
    if (status === 'rejected') {
      documents.rejectionReason = rejectionReason;
    }

    await documents.save();

    res.json({ message: `Documents ${status} successfully`, documents });
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if agency is verified
exports.checkVerification = async (req, res) => {
  try {
    const documents = await Document.findOne({ agency: req.user._id });
    
    const isVerified = documents && documents.status === 'approved';
    
    res.json({ isVerified, status: documents?.status || 'none' });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
