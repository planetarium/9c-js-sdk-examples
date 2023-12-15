import "dotenv/config";

import { RawPrivateKey, Address } from "@planetarium/account";
import {
    signTx,
    encodeSignedTx,
    Currency,
    encodeCurrency
} from "@planetarium/tx";
import { RecordView, encode } from "@planetarium/bencodex";
import { HeadlessGraphQLClient } from "./headless-graphql-client";

// Replacable with another implementations.
const account = RawPrivateKey.fromHex(process.env.RAW_PRIVATE_KEY!);  // Test or your own private key.

// This is written on the odin mainnet planet basis.
async function main() {
    const GRAPHQL_URL = "https://9c-main-rpc-1.nine-chronicles.com/graphql";
    const EXPLORER_URL_TEMPLATE = "https://9cscan.com/tx/<TXID>";  // If you use heimdall planet, it should be https://heimdall.9cscan.com/tx/<TXID>
    const headlessGQLClient = new HeadlessGraphQLClient(GRAPHQL_URL, 5);
    const signer = await account.getAddress();  // Equal to sender.
    // NOTE: bridge address is 0x9093dd96c4bb6b44a9e0a522e2de49641f146223
    const recipient = Address.fromHex("0x9093dd96c4bb6b44a9e0a522e2de49641f146223", true);
    const MEMO = "<ETHEREUM_ADDRESS>";
    const NCG_AMOUNT = 1n; // An amount to send. This must be a decimalized value. If you want to send "1.00" NCG, this value should be 100n.

    const NCG: Currency = {
        ticker: "NCG",
        decimalPlaces: 2,
        minters: new Set([
            Address.fromHex("0x47d082a115c63e7b58b1532d20e631538eafadde", true).toBytes(),
        ]),
        totalSupplyTrackable: false,
        maximumSupply: null,
    };

    // MEAD is NineChronicles network transaction fee currency.
    const MEAD = {
        ticker: "Mead",
        decimalPlaces: 18,
        minters: null,
        totalSupplyTrackable: false,
        maximumSupply: null,
    };

    const action = new RecordView(
        {
            type_id: "transfer_asset5",
            values: {
                amount: [
                    encodeCurrency(NCG),
                    NCG_AMOUNT,
                ],
                sender: signer.toBytes(),
                recipient: recipient.toBytes(),
                memo: MEMO,
            },
        },
        "text"
    );

    const signedTx = await signTx({
        nonce: BigInt(await headlessGQLClient.getNextTxNonce(signer.toString())),
        publicKey: (await account.getPublicKey()).toBytes("uncompressed"),
        signer: signer.toBytes(),
        timestamp: new Date(),
        updatedAddresses: new Set(),
        genesisHash: Buffer.from(await headlessGQLClient.getGenesisHash(), "hex"),
        actions: [action],
        maxGasPrice: {
            currency: MEAD,
            rawValue: 10n ** 18n,
        },
        gasLimit: 4n,
    }, account);
    const serializedSignedTx = encode(encodeSignedTx(signedTx));
    const tx = Buffer.from(serializedSignedTx).toString("hex");

    const txid = await headlessGQLClient.stageTransaction(tx);
    console.log(EXPLORER_URL_TEMPLATE.replace("<TXID>", txid));
}

main().then().catch(console.error);
