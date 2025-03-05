import express, { json } from 'express';
import fileUpload from 'express-fileupload';
const router = express.Router();
import csvToJson from 'convert-csv-to-json';
import * as Constants from '../constants.js';

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

function getJsonFromCsv(files) {
   // Initialize actionsByCategory object with empty arrays for each category
   const actionsByCategory = Object.keys(Constants.keyWordsByCategory).reduce((acc, key) => {
    acc[key] = {};
    return acc;
  }, {});

  // Add an empty array for incomes and others
  actionsByCategory.incomes = {};
  actionsByCategory.others = {};

  const categoryAmounts = Object.keys(Constants.keyWordsByCategory).reduce((acc, key) => {
    acc[key] = 0.0;
    return acc;
  }, {});

  // Add an empty array for incomes and others
  categoryAmounts.incomes = 0.0;
  categoryAmounts.others = 0.0;

  Object.values(files).forEach(uploadedFile => {
    const jsonArray = csvToJson.supportQuotedField(true).getJsonFromCsv(uploadedFile.tempFilePath);

    const bankActionColumnKey = Object.keys(jsonArray[0]).find(key => Constants.bankActionColumn.includes(key));
    const bankAmountColumnKey = Object.keys(jsonArray[0]).find(key => Constants.bankAmountColumn.includes(key));

    if (bankActionColumnKey && bankAmountColumnKey) {
      
      jsonArray.forEach(obj => {
        let added = false;

        if (parseFloat(obj[bankAmountColumnKey]) > 0) {
          categoryAmounts['incomes'] += parseFloat(obj[bankAmountColumnKey]);

          
          // Add action to actionsByCategory, if it doesn't exist already
          if (Object.keys(actionsByCategory.incomes).length === 0 || Object.keys(actionsByCategory.incomes).every(action => action !== obj[bankActionColumnKey])) {
            actionsByCategory.incomes[obj[bankActionColumnKey]] = obj[bankAmountColumnKey];
          } else {
            // If action already exists, add the amount to the existing amount
            actionsByCategory.incomes[obj[bankActionColumnKey]] = parseFloat(actionsByCategory.incomes[obj[bankActionColumnKey]]) + parseFloat(obj[bankAmountColumnKey]);
          }
          added = true;
        } else {
          for (const category of Object.keys(Constants.keyWordsByCategory)) {
            if (Constants.keyWordsByCategory[category].some(word => obj[bankActionColumnKey].toLowerCase().includes(word.toLowerCase()))) {
              categoryAmounts[category] += parseFloat(obj[bankAmountColumnKey]);
              added = true;
              
              if (Object.keys(actionsByCategory[category]).length === 0 || Object.keys(actionsByCategory[category]).every(action => action !== obj[bankActionColumnKey])) {
                actionsByCategory[category][obj[bankActionColumnKey]] = parseFloat(obj[bankAmountColumnKey]);
              } else {
                // If action already exists, add the amount to the existing amount
                actionsByCategory[category][obj[bankActionColumnKey]] = parseFloat(actionsByCategory[category][obj[bankActionColumnKey]]) + parseFloat(obj[bankAmountColumnKey]);
              }
              break;
            }
          }
        }

        if (!added) {
          categoryAmounts['others'] += parseFloat(obj[bankAmountColumnKey]);
          if (Object.keys(actionsByCategory.others).length === 0 || Object.keys(actionsByCategory.others).every(action => action !== obj[bankActionColumnKey])) {
            actionsByCategory.others[obj[bankActionColumnKey]] = obj[bankAmountColumnKey];
          } else {
            actionsByCategory.others[obj[bankActionColumnKey]] = parseFloat(actionsByCategory.others[obj[bankActionColumnKey]]) + parseFloat(obj[bankAmountColumnKey]);
          }
        }
      });
    }

    // Print information about the file to the console
    console.log(`File Name: ${uploadedFile.name}`);
    console.log(`File Size: ${uploadedFile.size}`);
    console.log(`File MD5 Hash: ${uploadedFile.md5}`);
    console.log(`File Mime Type: ${uploadedFile.mimetype}`);
  });

  // count all actions except incomes and add new key, value pair to categoryAmounts called 'kulutYhteensa'.
  let kulutYhteensa = 0;
  Object.keys(categoryAmounts).forEach(key => {
    if (key !== 'incomes') {
      kulutYhteensa += categoryAmounts[key];
    }
  });
  categoryAmounts['kulutYhteensa'] = kulutYhteensa;
  
  return jsonToCsv(categoryAmounts, actionsByCategory);
}

function jsonToCsv(jsonObject, categoryJson) {

  let csv = 'Kategoria, Summa\n';
  for (const [key, value] of Object.entries(jsonObject)) {
    csv += `${key}, ${value}\n`;

    if (categoryJson[key] && Object.keys(categoryJson[key]).length > 0) {

      for (const [key1, value1] of Object.entries(categoryJson[key])) {
        const amount = value1.toString().replace(',', '.');
        csv += `***${key1}, ${amount}\n`;
      }
    }
  }

  csv += '\n\n';

  return csv;
}

export default router;