import { log } from 'console'
import { channel } from 'diagnostics_channel'
import DiscordJS, { ChannelManager, Intents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config() // to get access to the variables from .env file

const GUILD_ID = "1013893737186869318"
const CHANNEL_ID = "1013895771294277632"

const client = new DiscordJS.Client({
    intents: [ //specify the intentiens of our bot, what he want to do in discord
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
})

let guild: any = null;

client.on('ready', () => {
    console.log('#Discord : bot ready', client.user?.tag);
    guild = client.guilds.cache.get(GUILD_ID)
    if (guild !== null) {
        console.log('#Discord :guild available');
        guild?.members.fetch()
            .then((data: any) => {
                data.forEach((element: any) => {
                    console.log(`user tag: ${element.user.tag}\tisBot: ${element.user.bot}`);

                });
            }).catch((err: any) => {
                console.log('#discord error ', err)
            })
    }
})
//Start discord BOT 
client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('#discord : connected');
}).catch((err) => {
    console.error('#discord error: ', err);
})

export const verifyUser = (user: string) => {
    return new Promise<any>((resolve, reject) => {
        // console.log("user : ", JSON.stringify(user));
        guild?.members.fetch()
            .then((data: any) => {
                console.log("# Discord promise resolved");
                let status: boolean = false;
                data.forEach((element: any) => {
                    if (element.user.tag === user) status = true
                });
                resolve(status);
            }).catch((err: any) => {
                console.log('error ', err)
                reject(`#discord error : ${err}`)
            })
    })
}

export const sendMessageParticipate = async (user: string) => {
    //discord js : send a message to the DISCORD_CHANEL
    try {
        let channel: any = client.channels.cache.get(CHANNEL_ID);
        let discordUser: any = await getMemberByTag(user)
        console.log("user ", discordUser)
        const attachment = new DiscordJS.MessageAttachment('./source/assets/images/meme.jpg')
        const embed = new DiscordJS.MessageEmbed()
            .setDescription(`See you for the raffle on Monday August 22th at 10:00pm (GMT+2) <@${discordUser.id}> !`)
            .setTitle(`Good luck getting on the HGC whitelist Gangsta 👊`)
            .setColor(0xffdd00)
            // .setImage(discordUser.displayAvatarURL({ format: 'png' })) //display user Avatar
            .setImage('attachment://meme.jpg')
        // channel.send(`<@${discordUser.id}> `)
        await channel.send({ embeds: [embed], files:[attachment] })
        return true
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getMemberByTag = async (member: string) => {
    return new Promise<void>((resolve, reject) => {
        guild?.members.fetch()
            .then((data: any) => {
                // console.log("in member Get");
                //element is a GuildMember
                data.forEach((element: any) => {
                    if (element.user.tag === member) {
                        resolve(element.user)
                    }
                });
                reject({message:"invalid discord member"})
            }).catch((err: any) => {
                console.log('error ', err)
                reject(err)
            })
    })

}