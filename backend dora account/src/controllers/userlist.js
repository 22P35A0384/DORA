import Userschema from '../models/user_list.js';

const Checkmail = async(req,res,next)=>{
    const email = req.params.mail;
    let Data;
    try{
        Data = await Userschema.findOne({mail:email})
    }catch(err){
        console.log(err)
    }
    if(Data){
        return res.status(200).json(true)
    }else{
        return res.status(200).json(false)
    }
}

export default Checkmail;