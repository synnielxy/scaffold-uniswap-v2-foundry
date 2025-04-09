/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    YourContract: {
      address: "0xe1aa25618fa0c7a1cfdab5d6b456af611873b629",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_owner",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "receive",
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "greeting",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "premium",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "setGreeting",
          inputs: [
            {
              name: "_newGreeting",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "totalCounter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "userGreetingCounter",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "withdraw",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "GreetingChange",
          inputs: [
            {
              name: "greetingSetter",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newGreeting",
              type: "string",
              indexed: false,
              internalType: "string",
            },
            {
              name: "premium",
              type: "bool",
              indexed: false,
              internalType: "bool",
            },
            {
              name: "value",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1744238616.json",
      deploymentScript: "Deploy.s.sol",
    },
    UniswapV2Factory: {
      address: "0x9528335f86cd55dc446acc17c6bd6890224dab60",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_feeToSetter",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "allPairs",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "allPairsLength",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "createPair",
          inputs: [
            {
              name: "tokenA",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenB",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "pair",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "feeTo",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "feeToSetter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getPair",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "setFeeTo",
          inputs: [
            {
              name: "_feeTo",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setFeeToSetter",
          inputs: [
            {
              name: "_feeToSetter",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "PairCreated",
          inputs: [
            {
              name: "token0",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "token1",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "pair",
              type: "address",
              indexed: false,
              internalType: "address",
            },
            {
              name: "",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1744238616.json",
      deploymentScript: "Deploy.s.sol",
    },
    UniswapV2Router02: {
      address: "0x50e6eff490830221757f4008386276b5a74233c2",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_factory",
              type: "address",
              internalType: "address",
            },
            {
              name: "_WETH",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "receive",
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "WETH",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "addLiquidity",
          inputs: [
            {
              name: "tokenA",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenB",
              type: "address",
              internalType: "address",
            },
            {
              name: "amountADesired",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountBDesired",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountAMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountBMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountA",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountB",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "addLiquidityETH",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "amountTokenDesired",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountTokenMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETHMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountToken",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETH",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "factory",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getAmountIn",
          inputs: [
            {
              name: "amountOut",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "reserveIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "reserveOut",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "getAmountOut",
          inputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "reserveIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "reserveOut",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountOut",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "getAmountsIn",
          inputs: [
            {
              name: "amountOut",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getAmountsOut",
          inputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "quote",
          inputs: [
            {
              name: "amountA",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "reserveA",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "reserveB",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountB",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "removeLiquidity",
          inputs: [
            {
              name: "tokenA",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenB",
              type: "address",
              internalType: "address",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountAMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountBMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountA",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountB",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "removeLiquidityETH",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountTokenMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETHMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountToken",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETH",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "removeLiquidityETHSupportingFeeOnTransferTokens",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountTokenMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETHMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amountETH",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "removeLiquidityETHWithPermit",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountTokenMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETHMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "approveMax",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "v",
              type: "uint8",
              internalType: "uint8",
            },
            {
              name: "r",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "s",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "amountToken",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETH",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
          inputs: [
            {
              name: "token",
              type: "address",
              internalType: "address",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountTokenMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountETHMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "approveMax",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "v",
              type: "uint8",
              internalType: "uint8",
            },
            {
              name: "r",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "s",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "amountETH",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "removeLiquidityWithPermit",
          inputs: [
            {
              name: "tokenA",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenB",
              type: "address",
              internalType: "address",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountAMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountBMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "approveMax",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "v",
              type: "uint8",
              internalType: "uint8",
            },
            {
              name: "r",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "s",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "amountA",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountB",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "swapETHForExactTokens",
          inputs: [
            {
              name: "amountOut",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "swapExactETHForTokens",
          inputs: [
            {
              name: "amountOutMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
          inputs: [
            {
              name: "amountOutMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "swapExactTokensForETH",
          inputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountOutMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
          inputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountOutMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "swapExactTokensForTokens",
          inputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountOutMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
          inputs: [
            {
              name: "amountIn",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountOutMin",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "swapTokensForExactETH",
          inputs: [
            {
              name: "amountOut",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountInMax",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "swapTokensForExactTokens",
          inputs: [
            {
              name: "amountOut",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "amountInMax",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "path",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "deadline",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "amounts",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          stateMutability: "nonpayable",
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1744238616.json",
      deploymentScript: "Deploy.s.sol",
    },
    TestERC20: {
      address: "0xdb5185bd29676821ec8d1a867905a34a6f64828d",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "n",
              type: "string",
              internalType: "string",
            },
            {
              name: "s",
              type: "string",
              internalType: "string",
            },
            {
              name: "d",
              type: "uint8",
              internalType: "uint8",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "allowance",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
            {
              name: "spender",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "approve",
          inputs: [
            {
              name: "spender",
              type: "address",
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "balanceOf",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "decimals",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint8",
              internalType: "uint8",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "mint",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "name",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "symbol",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "totalSupply",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "transfer",
          inputs: [
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "transferFrom",
          inputs: [
            {
              name: "from",
              type: "address",
              internalType: "address",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "Approval",
          inputs: [
            {
              name: "owner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "spender",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "value",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "Transfer",
          inputs: [
            {
              name: "from",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "to",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "value",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1744238616.json",
      deploymentScript: "Deploy.s.sol",
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
