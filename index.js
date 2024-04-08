import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 4000;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
})


app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});