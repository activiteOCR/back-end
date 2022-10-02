import { getMemberByTag, sendMessageParticipate } from "../discord"
import followerModel from "../models/followers.module"
import participantModel from "../models/participants.model"

export const saveFollower = async (follower: any) => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let doc_follower = new followerModel({
                ...follower
            })
            let saveUser = await doc_follower.save();
            console.log('saveUser', saveUser)
            resolve(true)
        } catch (error: any) {
            // console.error('error.code',typeof( error.code));
            reject(error);
        }
    })
}
interface Participant {
    twitter: string,
    discord: string,
    discordId:string
    //wallet: string
}
export const saveParticipant = async (participant: Participant) => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let discordMember:any = await getMemberByTag(participant.discord)
            // console.log('dscord member', discordMember);
            let doc_participant = new participantModel({
                ...participant,
                discordId:discordMember.id
            })
            let saveParticipant = await doc_participant.save();
            // console.log('saveParticipant', saveParticipant)
            sendMessageParticipate(participant.discord)
                .catch((err) => {
                    throw err
                })
                //push to smartContract "participant.discord"
            resolve(true)
        } catch (error: any) {
            // console.log('saveParticipant', error.message)
            reject(error);
        }
    })
}

export const pickWinner = () => {
    //listen to event
    //send message to discord channel with winner message
    //websocket : send winner to frontend 
}