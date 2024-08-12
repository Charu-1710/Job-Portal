// SDjoFINehtswaW4r
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from './routes/user.js';
import companyRoute from './routes/company.js'
import jobRoute from './routes/job.js'
import applicationRoute from './routes/application.js'
import crypto from 'crypto'
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({})
const app = express();



const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log("__dirname :",__dirname )
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser())
const corsOption = {
    origin : 'http://localhost:5173',
    credentials : true
}
app.use(cors(corsOption));

// api
app.use('/api/v1/user',userRoute);
app.use('/api/v1/company',companyRoute);
app.use('/api/v1/job',jobRoute);
app.use('/api/v1/application',applicationRoute);

crypto.randomBytes(12,(err,bytes)=>{
    console.log(bytes.toString("hex"))
})




app.listen(port,()=>{
    connectDB();
    console.log(`server running at ${port}`)
})
