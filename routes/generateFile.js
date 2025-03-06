import express from 'express';
import fileUpload from 'express-fileupload';
import getJsonFromCsv from '../utils/getJsonFromCsv.js';
const router = express.Router();

// File upload configuration
const uploadConfig = {
  // Configure file uploads with maximum file size 10MB
  limits: { fileSize: 10 * 1024 * 1024 },

  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles: true,
  tempFileDir: '/tmp/'
};

router.use(fileUpload(uploadConfig));

router.post('/', async (req, res) => {
  try {
    // Check if a file was submitted
    if (!req.files || !req.files.file1) {
      return res.status(422).send('No files were uploaded. Please upload at least one CSV file.');
    }

    // Process the uploaded files and generate the CSV
    const csv = getJsonFromCsv(req.files);

    // Set response headers and send the generated CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('bankData.csv');
    res.send(csv);
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('An error occurred while processing the file.');
  }
});

export default router;