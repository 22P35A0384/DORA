import user_list from "../models/user_list.js";

const ImgGeneration = async (req, res) => {
  
    const {user} = req.body
    const userdata = await user_list.findOne({mail:user})
    let apicount;
    if(userdata.count){
      apicount = userdata.count
    }else{
      apicount = 0
    }
    let updateuserdata;
    if(apicount===100){
      return res.status(200).json(false)
    }else{
      updateuserdata = await user_list.findOneAndUpdate({ mail: user }, { $set: { count: apicount+1 } });
      return res.status(200).json(true)
      // return res.status(200).json(apicount+1)
    }
  }

export default ImgGeneration;
