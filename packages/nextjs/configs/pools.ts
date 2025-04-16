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

export const routerAddress = "0x8db4658427ab3bd0dca5df4181e50896d57eb67c";

export const pools: Pool[] = [
  {
    id: 1,
    address: "0xF2a762db66df03ffb68B990d02EF15676153D995",
    token0: {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    token1: {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  },
  {
    id: 2,
    address: "0xb55cafAd5eBab8C2d7D902cA652bb415bEc1A711",
    token0: {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    token1: {
      name: "Uniswap",
      symbol: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
  },
  {
    id: 3,
    address: "0xf6E89cE0CeC6b87dDD9c5E7E8B7Cd4a2bcb03E27",
    token0: {
      name: "Uniswap",
      symbol: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    token1: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
  },
  {
    id: 4,
    address: "0x1E66d6eA1F8c067623C76fC85507eD1184cc6f9E",
    token0: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    token1: {
      name: "Chainlink",
      symbol: "LINK",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
  },
  {
    id: 5,
    address: "0x190eDb1Da757A9036A0aC590af3975207fE9E753",
    token0: {
      name: "Chainlink",
      symbol: "LINK",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    token1: {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  },
];
