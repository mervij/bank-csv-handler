import jsonToCsv from "./jsonToCsv.js";
import csvToJson from 'convert-csv-to-json';
import * as Constants from '../constants.js';

// Initialize category objects for actions and amounts
function initializeCategoryObjects() {
  const actionsByCategory = Object.keys(Constants.KEY_WORDS_BY_CATEGORIES).reduce((acc, key) => {
    acc[key] = {};
    return acc;
  }, {});

  actionsByCategory[Constants.OTHERS] = {};
  actionsByCategory[Constants.INCOMES] = {};

  const categoryAmounts = Object.keys(Constants.KEY_WORDS_BY_CATEGORIES).reduce((acc, key) => {
    acc[key] = 0.0;
    return acc;
  }, {});

  categoryAmounts[Constants.OTHERS] = 0.0;
  categoryAmounts[Constants.ALL_EXPENSES] = 0.0;
  categoryAmounts[Constants.INCOMES] = 0.0;

  return { actionsByCategory, categoryAmounts };
}

// Process each transaction and categorize it
function processTransaction(obj, bankActionColumnKey, bankAmountColumnKey, actionsByCategory, categoryAmounts) {
  let added = false;
  const amount = parseFloat(obj[bankAmountColumnKey]);

  if (amount > 0) {
    categoryAmounts[Constants.INCOMES] += amount;
    addOrUpdateAction(actionsByCategory[Constants.INCOMES], obj[bankActionColumnKey], amount);
    added = true;
  } else {
    for (const category of Object.keys(Constants.KEY_WORDS_BY_CATEGORIES)) {
      if (Constants.KEY_WORDS_BY_CATEGORIES[category].some(word => obj[bankActionColumnKey].toLowerCase().includes(word.toLowerCase()))) {
        categoryAmounts[category] += amount;
        addOrUpdateAction(actionsByCategory[category], obj[bankActionColumnKey], amount);
        added = true;
        break;
      }
    }
  }

  if (!added) {
    categoryAmounts[Constants.OTHERS] += amount;
    addOrUpdateAction(actionsByCategory[Constants.OTHERS], obj[bankActionColumnKey], amount);
  }
}

// Add a new action or update an existing action in a category
function addOrUpdateAction(category, action, amount) {
  if (!category[action]) {
    category[action] = amount;
  } else {
    category[action] += amount;
  }
}

// Calculate the total expenses excluding incomes
function calculateTotalExpenses(categoryAmounts) {
  return Object.keys(categoryAmounts).reduce((sum, key) => {
    if (key !== Constants.INCOMES) {
      sum += categoryAmounts[key];
    }
    return sum;
  }, 0);
}

// Main function to process uploaded files and generate CSV
export default function getJsonFromCsv(files) {
  const { actionsByCategory, categoryAmounts } = initializeCategoryObjects();

  Object.values(files).forEach(uploadedFile => {
    const jsonArray = csvToJson.supportQuotedField(true).getJsonFromCsv(uploadedFile.tempFilePath);
    const bankActionColumnKey = Object.keys(jsonArray[0]).find(key => Constants.BANK_ACTION_COLUMN.includes(key));
    const bankAmountColumnKey = Object.keys(jsonArray[0]).find(key => Constants.BANK_AMOUNT_COLUMN.includes(key));

    if (bankActionColumnKey && bankAmountColumnKey) {
      jsonArray.forEach(obj => {
        processTransaction(obj, bankActionColumnKey, bankAmountColumnKey, actionsByCategory, categoryAmounts);
      });
    }

    console.log(`File Name: ${uploadedFile.name}`);
    console.log(`File Size: ${uploadedFile.size}`);
    console.log(`File MD5 Hash: ${uploadedFile.md5}`);
    console.log(`File Mime Type: ${uploadedFile.mimetype}`);
  });

  categoryAmounts[Constants.ALL_EXPENSES] = calculateTotalExpenses(categoryAmounts);

  return jsonToCsv(categoryAmounts, actionsByCategory);
}