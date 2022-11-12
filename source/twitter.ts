import { Client } from "twitter-api-sdk";
import { saveFollower } from "./services/giveaway.service";
import followerModel from "./models/followers.module";
import cron from "node-cron";

// import * as cron from "node-cron"

const HGC_ID = "1543653105757294595";

const API_KEY: any = process.env.TWITTER_API_KEY;
const API_SECRET_KEY: any = process.env.TWITTER_SECRET_API_KEY;
const TOKEN: any = process.env.ACCESS_TOKEN;
const TOKEN_SECRET: any = process.env.ACESS_TOKEN_SECRET;
const BEARER_TOKEN: any = process.env.TWITTER_BEARER_TOKEN;

const client = new Client(BEARER_TOKEN);
const sleep = (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};
export const verifyFollower = async (username: string) => {
  let status = false;
  return new Promise<any>(async (resolve, reject) => {
    try {
      // ! verify user in db
      let followers_db = await followerModel.findOne({ username: username });
      if (followers_db !== null) {
        console.log("follower found in db");
        status = true;
      } else {
        // ! verify new follower (not in db yet)
        let new_followers: any = await client.users.usersIdFollowers(HGC_ID, {
          max_results: 200,
        });
        new_followers.data.map((element: any, index: number) => {
          if (element.username === username) {
            status = true;
            console.log("new follower not in db yet ");
          }
        });
      }
      resolve(status);
    } catch (error) {
      console.error("#twitter error:", error);
      reject(error);
    }
  });
};
export const refreshFollowersDatabase = async () => {
  /**
   * ! API restrictions :
   *  + max follower/request = 200
   *  + max req per 15min = 15request
   */
  let followers_array: any[] = [];
  let error_counter: number = 0;
  console.log("refresh");
  try {
    const response: any = client.users.usersIdFollowers(HGC_ID, {
      // "user.fields": ["created_at"],
      max_results: 200,
    });
    for await (const page of response) {
      // page.data.forEach(async (element: any, index: number) => {
      for (const element of page.data) {
        // followers_array.push(element)
        let follower = await saveFollower(element);
        if (follower) {
          console.log(` + new follower ${follower}`);
        } else {
          console.log("follower already in db ");
        }
      }
      await sleep(30000);
    }
  } catch (error) {
    console.error("#twitter error :", error);
  }
};
// cron.schedule(('0 0 0 * * *'), () => {
//     refreshFollowersDatabase()
// })
//refreshFollowersDatabase();
console.log("refresh2");
// verifyFollower('AleksejTopalov').then(console.log).catch(console.error);
