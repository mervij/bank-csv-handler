import express from 'express';
import fileUpload from 'express-fileupload';
import getJsonFromCsv from '../utils/getJsonFromCsv.js';
const router = express.Router();

router.use(fileUpload({
  // Configure file uploads with maximum file size 10MB
  limits: { fileSize: 10 * 1024 * 1024 },

  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

router.post('/', async function(req, res, next) {
  // Was a file submitted?
  if (!req.files || !req.files.file1) {
    return res.status(422).send('No files were uploaded');
  }

  try {

    const csv = getJsonFromCsv(req.files);

    res.header('Content-Type', 'text/csv');
    res.attachment('bankData.csv');
    res.send(csv);
   
  } catch (err) {
    console.error('Error reading file', err);
    res.status(500).send('Error reading file');
  }
});

export default router;