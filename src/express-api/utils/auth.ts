import { Crypto } from "@ne1410s/crypto";
import { IHashResult } from "../interfaces/utils/auth";
import * as jwt from "jsonwebtoken";

export abstract class AuthUtils {

    public static async getHash(text: string): Promise<IHashResult> {
        
        const salt = await Crypto.randomString(),
              hash = await Crypto.digest(salt + text);

        return { hash, salt };
    }

    public static async verifyHash(text: string, test: IHashResult): Promise<boolean> {

        return await Crypto.digest(test.salt + text) == test.hash;
    }

    public static getToken(username: string, userSalt: string, minutes: number = 15): string {
        
        const payload = {
            aud: ['customer'],
            exp: Math.floor(Date.now() / 1000) + (60 * minutes),
            iat: Math.floor(Date.now() / 1000),
            iss: 'Acme Express',
            sub: username,
        };

        return jwt.sign(payload, userSalt);
    }

    public static verifyToken(token: string, username: string, userSalt: string): boolean {

        try { 
            return !!jwt.verify(token, userSalt, {
                audience: 'customer',
                issuer: 'Acme Express',
                subject: username,
            });
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}