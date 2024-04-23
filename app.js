const express = require("express");
const router = require("./src/route/api");
const app = new express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
//=====security measures=====//
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const path = require("path");
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(bodyParser.json());

// ===Request Rate Limiting===//
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use(limiter);
app.set('etag', false);

//====Mongo DB connection====//
let uri = "mongodb://127.0.0.1:27017/wardshop";
let options = { user: "", pass: "", autoIndex: true };
mongoose.connect(uri, options)
    .then(() => console.log('Mongo DB Connected Successfully!'));


//======Api Routes=====// 
app.use('/api/',router);

//=====Front End Connection====//
app.use(express.static('client-site/dist'));
app.get("*",(req,res)=>{
res.sendFile(path.resolve(__dirname,'client-site','dist','index.html'));
})




//===undefined routes===//
app.use('*', (req, res) => {
    res.status(404).json({
        status: "Fail",
        data: "Undefined url"
    });
});

module.exports = app