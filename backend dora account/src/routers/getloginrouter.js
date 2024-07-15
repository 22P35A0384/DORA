import PostLogin from "../controllers/Getlogin.js";
import express from 'express'
const Router = express.Router()

Router.post('/checkmail',PostLogin)

export default Router;