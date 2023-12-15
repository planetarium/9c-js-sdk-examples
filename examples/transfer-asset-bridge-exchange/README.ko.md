# Transfer Asset for bridge exchange

NCG -> WNCG 브릿지 요청 트랜잭션을 만드는 예제 스크립트입니다. NCG -> WNCG는 odin planet에서만 가능합니다.

## 0. `yarn` 를 실행해주세요

`yarn` 명령어를 실행해서 필요한 의존성들을 설치합니다.

```
% yarn
yarn install v1.22.19
warning package.json: No license field
warning No license field
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
✨  Done in 6.09s.
```

## 1. `.env` 를 설정해주세요

`.env.example` 를 복사하여 `.env` 파일을 만들어주시고 `RAW_PRIVATE_KEY` 에 사용하실 private key를 넣어주세요.

## 2. `MEMO`, `NCG_AMOUNT` 값을 수정해주세요

`index.ts` 파일에 있는 아래 부분을 수정해주셔야 합니다. `MEMO` 에는 이더리움 측에서 WNCG를 발급 받을 주소를 넣어주셔야 합니다. `NCG_AMOUNT` 에는 브릿지 처리할 NCG 양을 적으셔야 합니다. 소수점이 2자리이기 때문에 1 NCG를 WNCG로 바꾸고 싶다면 `100n` 을 넣어주셔야 합니다.

```typescript
const MEMO = "<ETHEREUM_ADDRESS>";
const NCG_AMOUNT = 1n; // An amount to send. This must be a decimalized value. If you want to send "1.00" NCG, this value should be 100n.
```

## 3. 실행

`yarn ts-node index.ts` 명령어를 실행하면 9cscan 블록 익스플로러 URL을 출력해줍니다.

```
transfer-asset-bridge-exchange % yarn ts-node index.ts
yarn run v1.22.19
warning package.json: No license field
$ /path/to/repo/examples/transfer-asset-ncg/node_modules/.bin/ts-node index.ts
https://9cscan.com/tx/74d4e6fbc09d371b90fb02fa7eecc369511c2c602710c0cbbfd038af21012388
✨  Done in 3.04s.
```
