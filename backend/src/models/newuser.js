import mongoose from "mongoose";
const schema = mongoose.Schema;

let NUsers = new schema({
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    profile:{
        type:String,
        // type:required
    }
});

export default mongoose.model('Normal Users',NUsers)