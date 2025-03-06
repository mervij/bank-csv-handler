// Column names of your own bank's actions and amounts. These are examples from OP and S-pankki in Finland.
// These needs to be exactly the same as in the CSV file you are processing.
// If you are unsure, you can check the column names from the CSV file you are processing.
export const BANK_ACTION_COLUMN = ['Saaja/Maksaja', 'Saajannimi'];
export const BANK_AMOUNT_COLUMN = ['MääräEUROA', 'Summa'];

/*
 * Keywords for categorizing transactions
 * These are examples of keywords for categorizing transactions into different categories.
 * You can add or remove keywords as needed.
 * The keywords are case-insensitive, so you don't need to worry about the case of the keywords.
 * The keywords are matched against the bank action column.
 * If a keyword is found in the bank action column, the transaction is categorized into the corresponding category.
 * If no keyword is found, the transaction is categorized into the 'OTHER EXPENSES' category.
 * The 'INCOMES' category is for transactions with positive amounts.
 * The 'TOTAL EXPENSES' category is for the total expenses excluding incomes.
 * You can add more categories as needed. 
 */
export const KEY_WORDS_BY_CATEGORIES = {
  GROCERY_STORE: ['prisma', 'k-citymarket', 'k-market', 's-market', 'lidl', 'alepa', 'sale', 'k-supermarket'],
  RESTAURANTS: ['McDonalds', 'mcd', 'hesburger', 'subway'],
  VISA: ['OP Vähittäisasiakkaat'],
  PHARMACY: ['Apteekki'],
  GASOLINE: ['abc', 'neste'],
  HEALTH: ['pihlajalinna'],
};

/* 
 * Constants for titles of incomes, other expenses, and total expenses
 */

export const INCOMES = 'INCOMES';
// This is a category for transactions that do not match any of the keywords
export const OTHERS = 'OTHER EXPENSES';
// This is a category for the total expenses excluding incomes
export const ALL_EXPENSES = 'TOTAL EXPENSES';

// Column titles string for the CSV file to be generated
export const CSV_COLUMN_TITLES = 'CATEGORY, SUM\n';
