import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoute from './api/routes/auth.js';
import userRoute from './api/routes/user.js';
import productRoute from './api/routes/product.js';
import orderRoute from './api/routes/order.js';
import { get404 } from './api/controllers/error.js';
import job from './api/cron.js';

const app = express();
const Port = process.env.PORT || 2000;

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log(err);
  });

// allow origin request from the url
app.use(cors());


// parse incoming body payload
app.use(express.json({ limit: '50mb' }));
// parse incoming url payload ++++
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// auth routes
app.use('/auth', authRoute);


//user routes
app.use('/users', userRoute);

//products routes
app.use('/products', productRoute);


//order routes
app.use('/orders', orderRoute);


app.use(get404);

app.listen(Port, console.log('server started at port 2000')
);

//cron job to restart the server cus of render activity 
job.start();


