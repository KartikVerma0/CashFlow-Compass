import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 4000;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING)
        console.log("Connected to Database");
    } catch (e) {
        console.log("Problem connecting to Database", e);
    }
}
connectToDatabase()



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/data/:dataId', (req, res) => {
    const { dataId } = req.params;
    res.render('data', { dataId })

})


app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});