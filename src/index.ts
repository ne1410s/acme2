import Text from "@ne1410s/text";
import Crypto from "@ne1410s/crypto";

export default abstract class Acme2 {

    public static async test(): Promise<any> {

        return await Crypto.gen();        
    }

}