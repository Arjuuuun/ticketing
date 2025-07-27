import mongoose from 'mongoose';
import { app } from './app';
import { CLIENT_RENEG_LIMIT } from 'tls';


const start = async( ) => {
  console.log("Starting the auth service");
  if(!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try{
  await mongoose.connect(process.env.MONGO_URI)
  console.log("coonnected to mongodb")
  }
  catch(err) {
    console.error(err);
  }
  app.listen(3000, () => {
  console.log('Aut service is running on port 3000');
});
}

start();