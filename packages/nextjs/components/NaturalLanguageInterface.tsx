"use client";
import { useState } from "react";
import { pools } from "../configs/pools";
import { parseWithModalLLM } from "./modalLLMParser";
import { parseEther } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// Types for structured representation
type TokenAmount = {
  amount: string;
  token: string;
};

type SwapInstruction = {
  type: "swap";
  from: TokenAmount;
  to: string;
};

type DepositInstruction = {
  type: "deposit";
  amount: TokenAmount;
};

type RedeemInstruction = {
  type: "redeem";
  amount: TokenAmount;
};

type StructuredInstruction = SwapInstruction | DepositInstruction | RedeemInstruction;

// Get all unique tokens from pools
const getAllTokens = () => {
  const tokenMap = new Map<string, { name: string; symbol: string; address: string }>();
  pools.forEach(pool => {
    tokenMap.set(pool.token0.symbol, pool.token0);
    tokenMap.set(pool.token1.symbol, pool.token1);
  });
  return Object.fromEntries(tokenMap);
};

const TOKEN_ADDRESSES = getAllTokens();

const getTokenAddress = (symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  if (!TOKEN_ADDRESSES[upperSymbol]) {
    throw new Error(`Token ${symbol} is not supported in our pools`);
  }
  return TOKEN_ADDRESSES[upperSymbol].address;
};

interface ContractCall {
  address: string;
  abi: any[];
  functionName: string;
  args: any[];
  value?: bigint;
}

const parseAmount = (amount: any): bigint => {
  if (typeof amount === "string") {
    // Remove any commas and whitespace
    const cleanAmount = amount.replace(/,/g, "").trim();
    // Check if it's a valid number
    if (!/^\d*\.?\d+$/.test(cleanAmount)) {
      throw new Error(`Invalid amount format: ${amount}`);
    }
    return parseEther(cleanAmount);
  } else if (typeof amount === "number") {
    return parseEther(amount.toString());
  }
  throw new Error(`Invalid amount type: ${typeof amount}`);
};

// ERC20 ABI for approve
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const NaturalLanguageInterface = () => {
  const [input, setInput] = useState("");
  const [structuredInstruction, setStructuredInstruction] = useState<StructuredInstruction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract: approveToken } = useWriteContract();
  const { writeContract: swapTokens } = useWriteContract();

  const { data: routerInfo } = useDeployedContractInfo("UniswapV2Router02");
  const routerAddress = routerInfo?.address;

  const validateNetwork = () => {
    if (!chainId) {
      throw new Error("Please connect to a network");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      validateNetwork();

      // Step 1: Call Modal LLM to convert NLI to structured representation
      const llmResponse = await parseWithModalLLM(input);
      if (!llmResponse) {
        throw new Error("Failed to process natural language");
      }

      // Convert LLM response to our structured representation
      const parsedInstruction: StructuredInstruction = {
        type: "swap",
        from: {
          amount: llmResponse.arguments.amountIn,
          token: llmResponse.arguments.tokenIn,
        },
        to: llmResponse.arguments.tokenOut,
      };

      // Step 2: Convert SR to contract call
      const tokenIn = getTokenAddress(parsedInstruction.from.token);
      const tokenOut = getTokenAddress(parsedInstruction.to);
      const amountIn = parseAmount(parsedInstruction.from.amount);

      if (!routerAddress) {
        throw new Error("Router address not found");
      }

      // Step 3: Execute the contract calls
      // First approve the router to spend tokens
      await approveToken({
        address: tokenIn as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [routerAddress, amountIn],
      });

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Then perform the swap
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      await swapTokens({
        address: routerAddress,
        abi: [
          {
            inputs: [
              { name: "amountIn", type: "uint256" },
              { name: "amountOutMin", type: "uint256" },
              { name: "path", type: "address[]" },
              { name: "to", type: "address" },
              { name: "deadline", type: "uint256" },
            ],
            name: "swapExactTokensForTokens",
            outputs: [{ name: "amounts", type: "uint256[]" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "swapExactTokensForTokens",
        args: [
          amountIn,
          (amountIn * BigInt(95)) / BigInt(100), // 5% slippage
          [tokenIn, tokenOut],
          address,
          BigInt(deadline),
        ],
      });

      setSuccessMessage(
        `Successfully swapped ${parsedInstruction.from.amount} ${parsedInstruction.from.token} for ${parsedInstruction.to}`,
      );
    } catch (error) {
      console.error("Error processing instruction:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-base-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Natural Language Interface</h2>
        <p className="text-sm text-gray-500 mb-4">Available tokens: {Object.keys(TOKEN_ADDRESSES).join(", ")}</p>
        {chainId && <p className="text-sm text-gray-500 mb-4">Current network chain ID: {chainId}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <input
              type="text"
              placeholder="Enter your command..."
              className="input input-bordered w-full"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={!address || isProcessing || !chainId}>
            {isProcessing
              ? "Processing..."
              : !chainId
                ? "Please connect to a network"
                : address
                  ? "Execute Command"
                  : "Please connect wallet"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-error text-error-content rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-4 bg-success text-success-content rounded-lg">
            <p className="font-bold">Success!</p>
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalLanguageInterface;
