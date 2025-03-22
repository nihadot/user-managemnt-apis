import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();


const PORT = process.env.PORT || 3000;

import appRoutes from "./index";
import { connectDB } from '@config/db.config';

app.use(appRoutes);

app.use('/test',(req,res)=>{
  res.json({success: true, message : 'Server is working'});
});


if(process.env.NODE_ENV === 'production'){
  console.log('Production mode');
}else{
  console.log('Development mode');
}

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected Successfully');

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  } catch (error: any) {
    console.error(`❌ Server Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
