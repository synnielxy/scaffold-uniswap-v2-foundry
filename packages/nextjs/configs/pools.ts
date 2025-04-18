export interface Token {
  name: string;
  symbol: string;
  address: string;
}

export interface Pool {
  id: number;
  address: string;
  token0: Token;
  token1: Token;
}

export const pools: Pool[] = [
  {
    id: 1,
    address: "0xA3e38cEe1D1ab4BdA96d47d12A5972cCf7301ED6",
    token0: {
      name: "Token A",
      symbol: "TKNA",
      address: "0xb95e60e596fD8e924763fAf3250ED711f08d9C34",
    },
    token1: {
      name: "Token B",
      symbol: "TKNB",
      address: "0xfc781e341Cf5C53eF665025B58Ab53174Ae4146C",
    },
  },
  {
    id: 2,
    address: "0x0314343922975Bd67a2C892FAcC2a7f28AD49017",
    token0: {
      name: "Token B",
      symbol: "TKNB",
      address: "0xfc781e341Cf5C53eF665025B58Ab53174Ae4146C",
    },
    token1: {
      name: "Token C",
      symbol: "TKNC",
      address: "0xb50059ec939f6e4fb6CC0B47aD774Da88ACCb477",
    },
  },
  {
    id: 3,
    address: "0x6CB914EAD3cbE9eB9f38Bcfe0c354Fe22F47b4B3",
    token0: {
      name: "Token C",
      symbol: "TKNC",
      address: "0xb50059ec939f6e4fb6CC0B47aD774Da88ACCb477",
    },
    token1: {
      name: "Token D",
      symbol: "TKND",
      address: "0x01F04712b14819B6763312f8F6100a647584A656",
    },
  },
  {
    id: 4,
    address: "0x93E8058359E791755A280544D71027a139e99987",
    token0: {
      name: "Token D",
      symbol: "TKND",
      address: "0x01F04712b14819B6763312f8F6100a647584A656",
    },
    token1: {
      name: "Token E",
      symbol: "TKNE",
      address: "0x0f7CF9c648ae7ed4F815fa2f0C7951401a954701",
    },
  },
  {
    id: 5,
    address: "0x586bEbe30ea4E95695A3fd6A3B450f4eb60D8EbD",
    token0: {
      name: "Token E",
      symbol: "TKNE",
      address: "0x0f7CF9c648ae7ed4F815fa2f0C7951401a954701",
    },
    token1: {
      name: "Token A",
      symbol: "TKNA",
      address: "0xb95e60e596fD8e924763fAf3250ED711f08d9C34",
    },
  },
];
