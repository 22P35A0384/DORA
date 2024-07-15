import Updatepass from "../controllers/updatepass.js";
import express from 'express';
const Router = express.Router();

Router.put('/updatepass',Updatepass);

export default Router;