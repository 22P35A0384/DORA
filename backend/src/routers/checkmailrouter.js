import Checkmail from "../controllers/checkmail.js";
import express from 'express';
const Router = express.Router()

Router.get('/checkmail/:mail',Checkmail);

export default Router;