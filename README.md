# Bank CSV File Handler

## Background

This application was developed solely for personal needs. The main goal was to consolidate transactions from different banks into a single sheet. Banks, at least in Finland, usually offer the possibility to download CSV files of transactions for a specific time period. This app allows you to create your own categories for transactions. Since this is made for personal use only, the app has a very simple visual UI with no visual design done so far. The most important thing was to make the handler work properly.

## Technologies Used

- Node.js
- Express.js
- Handlebars
- Nodemon

## Setting Up the Environment

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/bank-csv-handler.git
   cd bank-csv-handler
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Use the correct Node.js version:**
   Ensure you are using the correct version of Node.js. This project uses `nvm` (Node Version Manager) to manage Node.js versions.
   ```sh
   nvm use
   ```

4. **Start the development server:**
   ```sh
   npm start
   ```

   This will start the server with Nodemon, which will automatically restart the server when file changes are detected.

## Usage

1. **Modify the `constants.js`:**
   - The constants in `constants.js` (`constants_example.js` at the beginning) need to match your own bank's terms. For example, the column names for bank actions and amounts should be exactly the same as in the CSV file you are processing.
   - You can add or remove categories and keywords as needed. The keywords are case-insensitive and are matched against the bank action column. If a keyword is found in the bank action column, the transaction is categorized into the corresponding category. If no keyword is found, the transaction is categorized into the 'OTHER EXPENSES' category.
   - The 'INCOMES' category is for transactions with positive amounts. The 'TOTAL EXPENSES' category is for the total expenses excluding incomes.
   - Refer to the `constants_example.js` file for an example of how to set up your constants. Once you have configured your constants, rename the file to `constants.js`.

2. **Access the application:**
   Open your web browser and navigate to `http://localhost:3000`.

3. **Upload CSV files:**
   Select one or two CSV files to generate a summary CSV file. The generated file will categorize transactions based on predefined categories.

## Future Improvements

While the app serves its personal purpose, it could be improved in many ways if it were intended for wider use:

- **Visual Improvements:** Enhance the UI design for a better user experience.
- **Better Error Handling:** Implement more robust error handling mechanisms.
- **Dynamic Category Management:** Allow users to add and modify categories within the app. Currently, categories and other constants must be edited in the `constants.js` file.

Feel free to contribute or fork the repository to make your own improvements!