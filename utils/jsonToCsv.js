export default function jsonToCsv(jsonObject, categoryJson) {

  let csv = 'KATEGORIA, SUMMA\n';
  for (const [key, value] of Object.entries(jsonObject)) {
    csv += `${key}, ${value}\n`;

    if (categoryJson[key] && Object.keys(categoryJson[key]).length > 0) {

      for (const [key1, value1] of Object.entries(categoryJson[key])) {
        const amount = value1.toString().replace(',', '.');
        // Remove commas from key1
        const key1Trimmed = key1.replace(/,/g, '');
        csv += `***${key1Trimmed}, ${amount}\n`;
      }
    }
  }

  csv += '\n\n';

  return csv;
}