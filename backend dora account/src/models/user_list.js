import mongoose from "mongoose";
const schema = mongoose.Schema;

let User_List = new schema({
    mail:{
        type:String
    },
    count:{
        type:Number
    }
});

export default mongoose.model('User List',User_List)
