import axios, { AxiosResponse } from "axios";

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

interface GraphQLRequestBody {
    operationName: string | null;
    query: string;
    variables: Record<string, unknown>;
}

export class HeadlessGraphQLClient {
    private readonly _apiEndpoint: string;
    private readonly _maxRetry: number;

    constructor(apiEndpoint: string, maxRetry: number) {
        this._apiEndpoint = apiEndpoint;
        this._maxRetry = maxRetry;
    }

    get endpoint(): string {
        return this._apiEndpoint;
    }

    async getBlockHash(index: number): Promise<string> {
        const query = `query GetBlockHash($index: ID!)
        { chainQuery { blockQuery { block(index: $index) { hash } } } }`;
        const { data } = await this.graphqlRequest({
            operationName: "GetBlockHash",
            query,
            variables: {
                index,
            },
        });

        return data.data.chainQuery.blockQuery.block.hash;
    }

    async getNextTxNonce(address: string): Promise<number> {
        const query =
            "query GetNextTxNonce($address: Address!) { nextTxNonce(address: $address) } ";
        const response = await this.graphqlRequest({
            operationName: "GetNextTxNonce",
            query,
            variables: { address },
        });

        return response.data.data.nextTxNonce;
    }

    async getGenesisHash(): Promise<string> {
        const query =
            "query GetGenesisHash { chainQuery { blockQuery { block(index: 0) { hash } } } }";
        const response = await this.graphqlRequest({
            operationName: "GetGenesisHash",
            query,
            variables: {},
        });

        return response.data.data.chainQuery.blockQuery.block.hash;
    }

    async stageTransaction(payload: string): Promise<string> {
        const query = `mutation StageTransaction($payload: String!) { stageTransaction(payload: $payload) }`;
        const response = await this.graphqlRequest({
            operationName: "StageTransaction",
            query,
            variables: { payload },
        });

        return response.data.data.stageTransaction;
    }

    private async graphqlRequest(
        body: GraphQLRequestBody,
        retry: number = this._maxRetry
    ): Promise<AxiosResponse> {
        try {
            const response = await axios.post(this._apiEndpoint, body, {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 10 * 1000,
            });

            if (response.data.errors) throw response.data.errors;

            return response;
        } catch (error) {
            console.error(`Retrying left ${retry - 1}... error:`, error);
            if (retry > 0) {
                await delay(500);
                const response = await this.graphqlRequest(body, retry - 1);
                return response;
            }

            throw error;
        }
    }
}
