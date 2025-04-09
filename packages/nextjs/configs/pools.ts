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
    address: "0xfCC32192BE74c40aE747622e6e999196AaDF7d6d",
    token0: {
      name: "Token A",
      symbol: "TKNA",
      address: "0x3E528Dad74acAE7843fdD1003EF9d8569BC5d246",
    },
    token1: {
      name: "Token B",
      symbol: "TKNB",
      address: "0xfAf4bAD1C7C3D59Dd01FBD35cC3658e3727C6f3A",
    },
  },
  {
    id: 2,
    address: "0x01850AB7C1ff04CDc347A46801774Ef5fae33631",
    token0: {
      name: "Token B",
      symbol: "TKNB",
      address: "0xfAf4bAD1C7C3D59Dd01FBD35cC3658e3727C6f3A",
    },
    token1: {
      name: "Token C",
      symbol: "TKNC",
      address: "0x28cac7e7daDEcba40756D39F8Bb7C60A31BDbDdd",
    },
  },
  {
    id: 3,
    address: "0xe97CE8322d30997135bf8dEB40a244d47c28f8B8",
    token0: {
      name: "Token C",
      symbol: "TKNC",
      address: "0x28cac7e7daDEcba40756D39F8Bb7C60A31BDbDdd",
    },
    token1: {
      name: "Token D",
      symbol: "TKND",
      address: "0xe115C723F5997787139bFDB14d3020dD9A13b4f9",
    },
  },
  {
    id: 4,
    address: "0x6bD9665cC2C09CbB321214F9Da5cA4eB7BbB677C",
    token0: {
      name: "Token D",
      symbol: "TKND",
      address: "0xe115C723F5997787139bFDB14d3020dD9A13b4f9",
    },
    token1: {
      name: "Token E",
      symbol: "TKNE",
      address: "0x171398adF2Dc4038D3aEBf41a30f1C14978F7987",
    },
  },
  {
    id: 5,
    address: "0x970491D4C3D53B0321bDC19DE7E069413e433D80",
    token0: {
      name: "Token A",
      symbol: "TKNA",
      address: "0x3E528Dad74acAE7843fdD1003EF9d8569BC5d246",
    },
    token1: {
      name: "Token E",
      symbol: "TKNE",
      address: "0x171398adF2Dc4038D3aEBf41a30f1C14978F7987",
    },
  },
];
