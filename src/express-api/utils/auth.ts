import { Crypto } from "@ne1410s/crypto";
import { IHashResult } from "../interfaces/auth";
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

    public static getToken(userId: number, appSecret: string, minutes: number): string {
        
        const payload = {
            aud: ['customer'],
            exp: Math.floor(Date.now() / 1000) + (60 * minutes),
            iat: Math.floor(Date.now() / 1000),
            iss: 'Acme Express',
            sub: userId,
        };

        return jwt.sign(payload, appSecret);
    }

    public static verifyToken(token: string, appSecret: string): number {

        const payload = jwt.verify(token, appSecret, {
            audience: 'customer',
            issuer: 'Acme Express',
        }) as any;

        return payload.sub;
    }
}