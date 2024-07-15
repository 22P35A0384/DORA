import ImgGeneration from '../controllers/replicate.js';
import express from 'express';
const Router = express.Router();

Router.post('/ImgGeneration',ImgGeneration);

export default Router;