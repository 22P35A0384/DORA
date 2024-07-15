import Adduser from '../controllers/userlistupdate.js';
import express from 'express';
const Router = express.Router();


Router.post('/updateuserlist',Adduser);

export default Router;