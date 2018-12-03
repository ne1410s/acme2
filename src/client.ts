import Utility from "./utility";
import Service from "./service";

export default abstract class Client {

    public static async test3(): Promise<any> {

        const interim1 = await Utility.test();
        const interim2 = await Service.test2();
        return `${interim1}, oh ${interim2} horn`;
    }

}