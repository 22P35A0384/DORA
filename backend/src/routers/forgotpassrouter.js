import Forgotpass from "../controllers/forgotpass.js";
import express from 'express';
const Router = express.Router();

Router.get('/forgotpassword/:mail',Forgotpass);

export default Router;