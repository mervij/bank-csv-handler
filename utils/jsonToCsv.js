import * as Constants from '../constants.js';

// Convert JSON data to CSV format
export default function jsonToCsv(jsonObject, categoryJson) {
  let csv = Constants.CSV_COLUMN_TITLES;

  for (const [category, amount] of Object.entries(jsonObject)) {
    csv += `${category}, ${amount}\n`;

    if (categoryJson[category] && Object.keys(categoryJson[category]).length > 0) {
      for (const [action, actionAmount] of Object.entries(categoryJson[category])) {
        const sanitizedAction = action.replace(/,/g, ''); // Remove commas from action
        csv += `***${sanitizedAction}, ${actionAmount}\n`;
      }
    }
  }

  return csv;
}