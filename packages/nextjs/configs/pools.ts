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
    address: "0x9B36991A0D2772c4A1a06e4f99fE195374A3dA0F",
    token0: {
      name: "Token A", 
      symbol: "TKNA",
      address: "0x7cAed286b41Df65Bd6C03d0Cb02629487DDFE234"
    },
    token1: {
      name: "Token B",
      symbol: "TKNB", 
      address: "0xbFd6B62b2534Ba7F02e47609Cf2d4B50B27c5403"
    }
  },
  {
    id: 2,
    address: "0x274154E07fC992A6d4CF60C473c8FAd3cee01050",
    token0: {
      name: "Token B",
      symbol: "TKNB",
      address: "0xbFd6B62b2534Ba7F02e47609Cf2d4B50B27c5403"
    },
    token1: {
      name: "Token C",
      symbol: "TKNC",
      address: "0xa243193503fAE4F1931d854f0B94844666F1CAF3"
    }
  },
  {
    id: 3,
    address: "0x03cEbbb66d8fE51daEEd43bc9c52deA0563Ece50",
    token0: {
      name: "Token C",
      symbol: "TKNC",
      address: "0xa243193503fAE4F1931d854f0B94844666F1CAF3"
    },
    token1: {
      name: "Token D",
      symbol: "TKND",
      address: "0xb95e60e596fD8e924763fAf3250ED711f08d9C34"
    }
  },
  {
    id: 4,
    address: "0xD59042a4BFf4F48Ac6E5dA0A04f256CfcA2F2c07",
    token0: {
      name: "Token D",
      symbol: "TKND",
      address: "0xb95e60e596fD8e924763fAf3250ED711f08d9C34"
    },
    token1: {
      name: "Token E",
      symbol: "TKNE",
      address: "0xfc781e341Cf5C53eF665025B58Ab53174Ae4146C"
    }
  },
  {
    id: 5,
    address: "0xbE7dA9a9a5B35e204ada82e53E09e018Fd16CedB",
    token0: {
      name: "Token A",
      symbol: "TKNA",
      address: "0x7cAed286b41Df65Bd6C03d0Cb02629487DDFE234"
    },
    token1: {
      name: "Token E",
      symbol: "TKNE",
      address: "0xfc781e341Cf5C53eF665025B58Ab53174Ae4146C"
    }
  }
]
