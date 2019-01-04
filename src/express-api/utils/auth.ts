import { Crypto } from "@ne1410s/crypto";
import { IHashResult } from "../interfaces/utils/auth";

export abstract class AuthUtils {

    public static async getHash(text: string): Promise<IHashResult> {
        
        const salt = await Crypto.randomString(),
              hash = await Crypto.digest(salt + text);

        return { hash, salt };
    }

    public static async testHash(text: string, test: IHashResult): Promise<boolean> {

        const hash = await Crypto.digest(test.salt + text);

        return hash === test.hash;
    }

    public static async getToken(userId: number) {
        
        return 'wootie' + userId;
    }
}