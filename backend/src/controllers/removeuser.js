import Userschema from '../models/newuser.js';
import user_list from '../models/user_list.js';

const Removeuser = async(req,res,next)=>{
    const mail = req.body.email
    // console.log(mail,pass)
    let deleteacc;
    let removeuser;
    let getdata;
    let getuser;
    try{
        getdata = await Userschema.findOne({email:mail})
        getuser = await user_list.findOne({mail:mail})
        if(getuser){
            removeuser = await user_list.findByIdAndDelete(getuser._id)
            if(getdata){
                deleteacc = await Userschema.findByIdAndDelete(getdata._id)
            }
            return res.status(200).json({msg:'User Removed Sucessfully!!!'})
        }else{
            return res.status(200).json({msg:'User Not Found in List'})
        }
        // else{
        //     return res.status(200).json({msg:'Error While Fetchin Data From Database'})
        // }
    }
    catch(err){
        console.log(err)
        return res.status(200).json({msg:'Error While Fetching Data From Database'})
    }
}

export default Removeuser;