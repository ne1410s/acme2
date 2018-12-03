import Utility from "./utility";

export default abstract class Service {

    public static async test2(): Promise<any> {

        const interim = await Utility.test();
        return `${interim} the floogle`;
    }

}