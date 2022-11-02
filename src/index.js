import express from 'express';
import cors from 'cors';
import { PORT } from "./config.js";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/files", express.static("public"));

import { router } from './routes/index.js';

app.use('/user', router);

app.use(express.json());


app.listen(PORT, () => { console.log('Running on port', PORT) });