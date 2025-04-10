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
    address: "0x147dD1C3554DCB733E4aa549c7B57c2A55A873b0",
    token0: {
      name: "Token A",
      symbol: "TKNA", 
      address: "0x694B9d20Ee80e474C69F7eC66904C591b9C41454"
    },
    token1: {
      name: "Token B",
      symbol: "TKNB",
      address: "0x9294e1900C507EFF9f957Dbb48D3FF80649FF6Ae"
    }
  },
  {
    id: 2,
    address: "0x5639de257975674e82339ca481bEFecA8e468f22",
    token0: {
      name: "Token B",
      symbol: "TKNB",
      address: "0x9294e1900C507EFF9f957Dbb48D3FF80649FF6Ae"
    },
    token1: {
      name: "Token C", 
      symbol: "TKNC",
      address: "0x5288a1798A3DC0E90Ff608011fE029C6Ef693b63"
    }
  },
  {
    id: 3,
    address: "0xAe389Cccdb1772acB8C8C8fD2ABC32157B1ec5aD",
    token0: {
      name: "Token C",
      symbol: "TKNC",
      address: "0x5288a1798A3DC0E90Ff608011fE029C6Ef693b63"
    },
    token1: {
      name: "Token D",
      symbol: "TKND",
      address: "0x395A2A16b873d6E902e31F1e2B913A41B2e8cF95"
    }
  },
  {
    id: 4,
    address: "0xE469dA5800b4404B4C2F8205Ed356DcCE9C8Aaeb",
    token0: {
      name: "Token D",
      symbol: "TKND",
      address: "0x395A2A16b873d6E902e31F1e2B913A41B2e8cF95"
    },
    token1: {
      name: "Token E",
      symbol: "TKNE",
      address: "0x34E116748b003841786cBe90911e1F8ad7b8e55e"
    }
  },
  {
    id: 5,
    address: "0x9765E5ED4E6194f9c429bf5079a0bE135b152182",
    token0: {
      name: "Token E",
      symbol: "TKNE",
      address: "0x34E116748b003841786cBe90911e1F8ad7b8e55e"
    },
    token1: {
      name: "Token A",
      symbol: "TKNA",
      address: "0x694B9d20Ee80e474C69F7eC66904C591b9C41454"
    }
  }
]
