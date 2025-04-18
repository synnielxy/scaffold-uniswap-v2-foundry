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

export const routerAddress = "0xAdc6f87EEEc9FD928AD135F24F56D2bFdaB0BF0c";

export const pools: Pool[] = [
  {
    id: 1,
    address: "0x528f3Cf7C467fB3AE72E3a031E456135306b2DE7",
    token0: {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    },
    token1: {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
  },
  {
    id: 2,
    address: "0x0c2faD24706b8B11F600C9DfF2f7C61B1c9183BC",
    token0: {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
    token1: {
      name: "Uniswap",
      symbol: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
  },
  {
    id: 3,
    address: "0xa8af82D703D1A162c55142dE27C479B7d6590a08",
    token0: {
      name: "Uniswap",
      symbol: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    token1: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6",
    },
  },
  {
    id: 4,
    address: "0xaE106ebcFE48DBeCbd7966aAAcd5BdB85cdc75EA7",
    token0: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6",
    },
    token1: {
      name: "Chainlink",
      symbol: "LINK",
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    },
  },
  {
    id: 5,
    address: "0xd908f7846249f5C0a2323468c4Ecf929B7C3C28e",
    token0: {
      name: "Chainlink",
      symbol: "LINK",
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    },
    token1: {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    },
  },
];
