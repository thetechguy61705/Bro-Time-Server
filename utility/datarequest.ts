import { ShardingManager, Shard, ShardClientUtil } from "discord.js";
var shard: ShardClientUtil;
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

    public static doRoundTrip(isInvalid?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            var request = new DataRequest(DataRequest.REQUEST_TYPE.RoundTrip,
                resolve, reject);
            if (isInvalid)
                request.isInvalid = isInvalid;
            pending.push(request);
            shard.send(request);
        });
    }
}

export class DataResponse {
    public sentInstance: string = "DataResponse"
    public result?: any
    public requestId: number

    public constructor(result: any, requestId: number) {
        this.result = result;
    }
}

export function setShard(newShard: ShardClientUtil) {
    shard = newShard;
}

export function processServer(request: DataRequest, shard: Shard): void {
    var result: any;
    switch (request.type) {
        case DataRequest.REQUEST_TYPE.RoundTrip: {
            if (request.isInvalid)
                result = new Error("The request was intentionally made invalid.");
        }
    }
    // fixme: The client is not receiving the message.
    shard.send(new DataResponse(result, request.requestId));
}

export function processClient(response: DataResponse): void {
    console.log("received response");
    var index = pending.findIndex((candidate) => candidate.requestId === response.requestId);
    console.log(index);
    if (index >= 0) {
        var request = pending[index];
        if (response.result instanceof Error) {
            request.reject(response.result);
        } else {
            request.resolve(response.result);
        }
        pending.splice(index, 1);
    }
}
