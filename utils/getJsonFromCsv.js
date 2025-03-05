import jsonToCsv from "./jsonToCsv.js";
import csvToJson from 'convert-csv-to-json';
import * as Constants from '../constants.js';

export default function getJsonFromCsv(files) {

  const incomes = 'TULOT';
  const allExpenses = 'KULUT YHTEENSÄ';
  const others = 'MUUT KULUT';

  // Initialize actionsByCategory object with empty arrays for each category
  const actionsByCategory = Object.keys(Constants.keyWordsByCategory).reduce((acc, key) => {
   acc[key] = {};
   return acc;
 }, {});

 // Add an empty array for incomes and others
 actionsByCategory[others] = {};
 actionsByCategory[incomes] = {};

 const categoryAmounts = Object.keys(Constants.keyWordsByCategory).reduce((acc, key) => {
   acc[key] = 0.0;
   return acc;
 }, {});

 // Add an empty array for incomes and others
 categoryAmounts[others] = 0.0;
 categoryAmounts[allExpenses] = 0.0;
 categoryAmounts[incomes] = 0.0;

 Object.values(files).forEach(uploadedFile => {
   const jsonArray = csvToJson.supportQuotedField(true).getJsonFromCsv(uploadedFile.tempFilePath);

   const bankActionColumnKey = Object.keys(jsonArray[0]).find(key => Constants.bankActionColumn.includes(key));
   const bankAmountColumnKey = Object.keys(jsonArray[0]).find(key => Constants.bankAmountColumn.includes(key));

   if (bankActionColumnKey && bankAmountColumnKey) {
     
     jsonArray.forEach(obj => {
       let added = false;

       if (parseFloat(obj[bankAmountColumnKey]) > 0) {
         categoryAmounts[incomes] += parseFloat(obj[bankAmountColumnKey]);

         
         // Add action to actionsByCategory, if it doesn't exist already
         if (Object.keys(actionsByCategory[incomes]).length === 0 || Object.keys(actionsByCategory[incomes]).every(action => action !== obj[bankActionColumnKey])) {
           actionsByCategory[incomes][obj[bankActionColumnKey]] = obj[bankAmountColumnKey];
         } else {
           // If action already exists, add the amount to the existing amount
           actionsByCategory[incomes][obj[bankActionColumnKey]] = parseFloat(actionsByCategory[incomes][obj[bankActionColumnKey]]) + parseFloat(obj[bankAmountColumnKey]);
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
         categoryAmounts[others] += parseFloat(obj[bankAmountColumnKey]);
         if (Object.keys(actionsByCategory[others]).length === 0 || Object.keys(actionsByCategory[others]).every(action => action !== obj[bankActionColumnKey])) {
           actionsByCategory[others][obj[bankActionColumnKey]] = obj[bankAmountColumnKey];
         } else {
           actionsByCategory[others][obj[bankActionColumnKey]] = parseFloat(actionsByCategory[others][obj[bankActionColumnKey]]) + parseFloat(obj[bankAmountColumnKey]);
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
 let expensesSum = 0;
 Object.keys(categoryAmounts).forEach(key => {
   if (key !== incomes) {
     expensesSum += categoryAmounts[key];
   }
 });
 categoryAmounts[allExpenses] = expensesSum;
 
 return jsonToCsv(categoryAmounts, actionsByCategory);
}