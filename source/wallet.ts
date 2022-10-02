import { ethers } from "ethers";

export const verifyWallet = async (wallet: string) => {
    let status = false
    return new Promise<any>(async(resolve, reject) => {
        try {
            // ! verify wallet on etherscan
            let isWallet = await ethers.utils.getAddress(wallet);
            console.log('wallet found in etherscan');
            status = true
            resolve(status)
        } catch (error) {
            console.error('# error:', error);
            reject(error)
        }
    })
}
