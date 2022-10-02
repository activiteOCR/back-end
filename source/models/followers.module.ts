import mongoose from "mongoose";

var Schema = mongoose.Schema;

var follower_modelSchema = new Schema({
    id:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    username:{type:String, required:true},
})

let followerModel = mongoose.model('followersModel', follower_modelSchema);
export default followerModel;
