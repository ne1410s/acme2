import Text from "@ne1410s/text";
import Crypto from "@ne1410s/crypto";
import { Acme2Env, Config } from "./config";

export default abstract class Utility {

    public static async test(): Promise<string> {

        var x = await Crypto.gen();
        return 'play';
    }

}