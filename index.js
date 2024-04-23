const app = require('./app');
const dotEnv = require('dotenv');
dotEnv.config({
        path: './config.env'
    })
    //const port = 3000;
app.listen(process.env.RUNNING_PORT, function() {
    console.log("server is running with port " + process.env.RUNNING_PORT)
});