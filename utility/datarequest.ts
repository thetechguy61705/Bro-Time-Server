import { Client, Shard } from "discord.js";
var client: Client = null;
var pending: DataRequest[] = [];
var nextRequestId = 0;

export class DataRequest {
    public static REQUEST_TYPE = new Enum(["RoundTrip"])
    public sentInstance: string = "DataRequest"
    public type: any
    public requestId: number
    public resolve?: { (value?: any): void }
    public reject?: { (reason?: any): void }

    public isInvalid?: boolean = false;

    private constructor(type: any,
        resolve: { (value?: any): void },
        reject: { (reason?: any): void }) {
        this.type = type;
        this.requestId = nextRequestId++;
        this.resolve = resolve;
        this.reject = reject;
    }

    private static sendRequest(request: DataRequest) {
        if (client == null)
            throw new Error("Unable to send a data request from the parent process.");
        pending.push(request);
        client.shard.send(request);
    }

    public static doRoundTrip(isInvalid?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            var request = new DataRequest(DataRequest.REQUEST_TYPE.RoundTrip,
                resolve, reject);
            if (isInvalid)
                request.isInvalid = isInvalid;
            DataRequest.sendRequest(request);
        });
    }
}

export class DataResponse {
    public sentInstance: string = "DataResponse"
    public result?: any
    public isError: boolean;
    public requestId: number

    public constructor(result: any, requestId: number) {
        this.isError = result instanceof Error;
        this.result = this.isError ? result.message : result;
        this.requestId = requestId;
    }
}

export function setClient(newClient: Client): void {
    client = newClient;
}

export function processServer(request: DataRequest, shard: Shard): void {
    var result: any;
    switch (DataRequest.REQUEST_TYPE.get(request.type)) {
        case DataRequest.REQUEST_TYPE.RoundTrip: {
            if (request.isInvalid)
                result = new Error("The request was intentionally made invalid.");
            break;
        }
        default:
            result = new Error("The data request type has not been implemented.");
    }
    shard.process.send(new DataResponse(result, request.requestId));
}

export function processClient(response: DataResponse): void {
    var index = pending.findIndex((candidate) => candidate.requestId === response.requestId);
    if (index >= 0) {
        var request = pending[index];
        if (response.result != null && response.isError) {
            request.reject(new Error(response.result));
        } else {
            request.resolve(response.result);
        }
        pending.splice(index, 1);
    }
}
