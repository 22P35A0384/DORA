import Checkmail from '../controllers/userlist.js';
import express from 'express';
const Router = express.Router();

Router.get('/checkusermail/:mail',Checkmail);

export default Router;