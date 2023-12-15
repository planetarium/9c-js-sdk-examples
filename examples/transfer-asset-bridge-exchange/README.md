# Transfer Asset for bridge exchange

This is an example script to create an NCG -> WNCG bridge request transaction. NCG -> WNCG is only available on odin planet.

## 0. Execute `yarn` to install dependencies.

Execute the `yarn` command to install the required dependencies.

```
% yarn
yarn install v1.22.19
warning package.json: No license field
warning No license field
[1/4] 🔍 Resolving packages...
[2/4] 🚚 Fetching packages...
[3/4] 🔗 Linking dependencies...
[4/4] 🔨 Building fresh packages...
✨ Done in 6.09s.
```

## 1. Set up `.env`.

Copy `.env.example` to create a `.env` file and put the private key you want to use in `RAW_PRIVATE_KEY`.

## 2. Modify the values of `MEMO` and `NCG_AMOUNT`.

In the `index.ts` file, you need to modify the following parts. In `MEMO`, you need to enter the address to receive WNCG from the Ethereum side. In `NCG_AMOUNT` you need to write the amount of NCG to be bridged. It has 2 decimal places, so if you want to convert 1 NCG to WNCG, you need to enter `100n`.

```typescript
const MEMO = "<ETHEREUM_ADDRESS>";
const NCG_AMOUNT = 1n; // An amount to send. This must be a decimalized value. If you want to send "1.00" NCG, this value should be 100n.
```

## 3. Execute

Execute the `yarn ts-node index.ts` command to output the 9cscan block explorer URL.

```
transfer-asset-bridge-exchange % yarn ts-node index.ts
yarn run v1.22.19
warning package.json: No license field
$ /path/to/repo/examples/transfer-asset-ncg/node_modules/.bin/ts-node index.ts
https://9cscan.com/tx/74d4e6fbc09d371b90fb02fa7eecc369511c2c602710c0cbbfd038af21012388
✨ Done in 3.04s.
```