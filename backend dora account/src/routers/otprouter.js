import Sendotp from '../controllers/otp.js';
import express from 'express';
const Router = express.Router();

Router.get('/sendotp/:id',Sendotp);

export default Router;