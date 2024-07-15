import Getuserlist from '../controllers/senduserlist.js';
import express from 'express';
const Router = express.Router();

Router.get('/getuserlist',Getuserlist);

export default Router;