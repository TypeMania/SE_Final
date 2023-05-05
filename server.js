require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { connectDB } = require('./config/dbConn.js');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(require('./routes/api/states.js'));
app.use(require('./routes/root.js'));

mongoose.connection.once('connected', ()=>{
    app.listen(80, ()=>console.log('CORS-enabled'))
    app.listen(process.env.PORT, ()=>console.log('listening'));
});