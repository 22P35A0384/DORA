import user_list from "../models/user_list.js";

const Getuserlist = async(req,res,next)=>{
    let data;
    try{
        data = await user_list.find()
        // console.log(rollno)
    }catch(err){
        console.log(err)
    }
    return res.status(200).json(data)
    // res.send(data._id)
}

export default Getuserlist;