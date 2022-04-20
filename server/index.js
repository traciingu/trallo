const express = require('express');
const app = express();
const { urlencoded } = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

app.use(cors());

app.listen(PORT, () => console.log(`Server is running...`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', require('./routes/api'));


