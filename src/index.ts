import Text from "@ne1410s/text";
import Crypto from "@ne1410s/crypto";

export default abstract class Acme2 {

    public static async test(): Promise<any> {

        var b64u = Text.textToBase64Url('hello, world');
        return await Crypto.gen();        
    }

}