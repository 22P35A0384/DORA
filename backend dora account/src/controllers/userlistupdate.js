import Userschema from '../models/user_list.js';

const Adduser = async(req,res,next)=>{
    const email = req.body.email;
    let Data;
    try{
        Data = await Userschema.findOne({mail:email})
    }catch(err){
        console.log(err)
        return res.status(200).json({msg:'Got Error While Fetching Data From Database!!!'})
    }
    if(Data){
        return res.status(200).json({msg:'This Mail Was Already In White List!!!'})
    }else{
        const Addnewuser = new Userschema({mail:email})
        await Addnewuser.save()
        return res.status(200).json({msg:"User Added Sucessfully!!!"})
    }
}

export default Adduser;