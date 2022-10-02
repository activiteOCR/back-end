import mongoose from "mongoose";

var Schema = mongoose.Schema;

var participant_modelSchema = new Schema({
    twitter:{type:String, required:true, unique:true},
    discord:{type:String, required:true, unique:true},
    discordId:{type:String, required:true, unique:true},
    //wallet:{type:String, required:true, unique:true}, // To check the wallet
    wallet:{type:String}
})

let participantModel = mongoose.model('participantsModel', participant_modelSchema);
export default participantModel;
