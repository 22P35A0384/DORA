import Addnewuser from '../controllers/addnewuser.js';
import express from 'express';
const Router = express.Router();


Router.post('/addnewuser',Addnewuser);

export default Router;