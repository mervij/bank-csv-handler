import express from 'express';
const app = express();
const port = 3000;
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';

import generateFile from './routes/generateFile.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/generate', generateFile);

app.get('/', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('main', {layout : 'index'});
});

app.listen(port, () => console.log(`App listening to port ${port}`));