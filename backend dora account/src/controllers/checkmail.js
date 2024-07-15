import Userschema from '../models/newuser.js';

const Checkmail = async(req,res,next)=>{
    const mail = req.params.mail
    // console.log(mail)
    let Checkmailid
    try{
        Checkmailid = await Userschema.findOne({email:mail})
    }catch(err){
        console.log(err)
    }
    // console.log(Checkmailid)
    // const id = Checkmailid._id
    if(Checkmailid){
        return res.status(200).json(false)
    }else{
        return res.status(200).json(true)
    }
}

export default Checkmail;