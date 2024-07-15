import Removeuser from '../controllers/removeuser.js';
import express from 'express';
const Router = express.Router();

Router.post('/removeuser',Removeuser);

export default Router;