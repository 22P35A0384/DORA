import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from "http"; 

import Addnewuserapp from './src/routers/addnewuserrouter.js';
import Sendotpapp from './src/routers/otprouter.js';
import Userlistupdateapp from './src/routers/userlistupdaterouter.js';
import Removeuserapp from './src/routers/removeuserrouter.js';
import Getuserlistapp from './src/routers/senduserlistrouter.js';
import Updatepassapp from './src/routers/updatepassrouter.js';
import Forgotpassapp from './src/routers/forgotpassrouter.js';
import Getloginapp from './src/routers/getloginrouter.js';
import Userlistapp from './src/routers/userlistrouter.js';
import Checkmailapp from './src/routers/checkmailrouter.js';
import ImgGenerationapp from './src/routers/replicaterouter.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://admin:auWYgAlCoe6fVCzu@dora.dnsasu1.mongodb.net/dora?retryWrites=true&w=majority&appName=Dora')
    .then(() => {
        // Create HTTP server using 'http.createServer'
        const server = http.createServer(app);
        
        // Specify the port and hostname for the server to listen on
        const port = 7000;

        server.listen(port,() => {
            console.log(`Server running at ${port}`);
            console.log('Database Connected && Server Started Successfully!! :)');
        });
    })
    .catch((err) => console.log(err));



// Production API Functions
app.use("/", Addnewuserapp);
app.use("/", Sendotpapp);
app.use("/",Userlistupdateapp);
app.use('/',Removeuserapp);
app.use('/',Getuserlistapp);
app.use('/',Updatepassapp); 
app.use('/',Forgotpassapp);
app.use('/',Getloginapp);
app.use('/',Userlistapp);
app.use('/',Checkmailapp);
app.use('/',ImgGenerationapp);



// Testing Space
app.get("/testing", (req, res, next) => {
    res.status(200).json({ "Status": "Server Working...!" });
});

app.post("/hello", (req, res, next) => {
    try{
        const data = req.body
        console.log(data)
        return res.status(200).json({"success":"user added"})
    }catch(err){
        console.log(err)
        return res.status(500).json({"error":err,"data":req.body})
    }
});

// Ensure the app listens on the port provided by the PORT environment variable
// app.listen(process.env.PORT || 8080, () => {
//     console.log(`Server is running on port ${port}`);
// });


// Create a Firebase Function to handle your Express app
export const api = onRequest(app);
