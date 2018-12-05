
export abstract class ServiceRequest {

    head: any;
    rawContent: string;
}

export abstract class JsonRequest<TBody> extends ServiceRequest {

    body: TBody;

    get rawContent(): string {
        return JSON.stringify(this.body);
    }
}