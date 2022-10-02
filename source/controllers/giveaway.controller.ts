import { Request, Response, NextFunction } from "express";
import logging from "../../config/logging";
import dotenv from 'dotenv'
import { verifyUser } from '../discord'
import { verifyFollower } from '../twitter'
import { verifyWallet } from '../wallet'
import { saveParticipant } from '../services/giveaway.service'


dotenv.config() // to get access to the variables from .env file
const NAMESPACE = 'API Controller'

const verifyDiscordUSer = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `req parameter ${req.params.username}`)
    try {
        let isDiscordUser = await verifyUser(req.params.username);
        return res.status(200).json({
            user: isDiscordUser
        })
    } catch (error) {
        logging.error(NAMESPACE, 'verify discord user', error);
        return res.status(400).json({
            message: 'discord server not responding',
            error: error
        })
    }
}
const verifyTwitterUSer = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `req parameter ${req.params.username}`)
    try {
        let isTwitterFollower = await verifyFollower(req.params.username);
        return res.status(200).json({
            user: isTwitterFollower
        })
    } catch (error) {
        logging.error(NAMESPACE, 'verify twitter follower', error);
        return res.status(400).json({
            message: 'twitter verification error !',
            error: error
        })
    }
}
const participate = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `post body ${req.body}`)
    /* data :  {
        wallet: 
        discord:
        twitter:
    }*/
    try {
        //let isWalletValid = await verifyWallet(req.body.wallet);
        //if(!isWalletValid) throw new Error("invalid Wallet");
        let isTwitterFollower = await verifyFollower(req.body.twitter);
        if(!isTwitterFollower) throw new Error("invalid twitter account");
        await saveParticipant(req.body)  
        return res.status(201).json({ message: "resource created" })
    } catch (error:any) {
        logging.error(NAMESPACE, 'save participant', error.message)
        return res.status(400).json({ message: error.message, code: "11000" })
    }
}


export default {
    verifyDiscordUSer,
    verifyTwitterUSer,
    participate
}