"use client";

import { useState } from "react";
import { pools } from "../configs/pools";
import { parseWithModalLLM } from "./modalLLMParser";
import PoolDataAnalysis from "./uniswap/PoolDataAnalysis";
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

type AddLiquidityInstruction = {
  type: "addLiquidity";
  tokenA: TokenAmount;
  tokenB: TokenAmount;
};

type StructuredInstruction = SwapInstruction | DepositInstruction | RedeemInstruction | AddLiquidityInstruction;

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
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract: approveToken } = useWriteContract();
  const { writeContract: swapTokens } = useWriteContract();

  const { data: routerInfo } = useDeployedContractInfo("UniswapV2Router02");
  const routerAddress = routerInfo?.address;

  const commonCommands = [
    { value: "", label: "Select a command or type your own" },
    { value: "swap 100 TKNA for TKNB", label: "Swap 100 TKNA for TKNB" },
    { value: "swap 1 TKNB for TKNA", label: "Swap 1 TKNB for TKNA" },
    { value: "add 100 TKNA and 100 TKNB to liquidity", label: "Add 100 TKNA and 100 TKNB to liquidity" },
    { value: "add 50 TKNA and 50 TKNB to liquidity", label: "Add 50 TKNA and 50 TKNB to liquidity" },
    { value: "what are the reserves of the pool TKNB-TKNA", label: "Check pool reserves" },
    { value: "how many swaps have there been today", label: "Check today's swaps" },
    { value: "what is the current price of TKNB in TKNA", label: "Check current price" },
    { value: "show me the price history of TKNB-TKNA over the past week", label: "View price history (1 week)" },
    { value: "what is the total liquidity in the TKNB-TKNA pool", label: "Check total liquidity" },
    { value: "what is the trading volume in the last 24 hours", label: "Check 24h volume" },
    // Challenging commands that might fail
    { value: "predict the price of TKNB in TKNA next week", label: "Predict future price (will fail)" },
    { value: "what is the optimal amount to swap for maximum profit", label: "Find optimal swap (will fail)" },
    { value: "show me all arbitrage opportunities in the pool", label: "Find arbitrage (will fail)" },
    { value: "what is the impermanent loss if I add liquidity now", label: "Calculate IL (will fail)" },
    { value: "what is the best time to swap based on historical data", label: "Find best time (will fail)" },
  ];

  const [llmOutput, setLlmOutput] = useState<string>("");
  const [llmError, setLlmError] = useState<string>("");

  const handleCommandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

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
    setAnalysisResult(null);
    setLlmOutput("");
    setLlmError("");

    try {
      validateNetwork();

      // Step 1: Call Modal LLM to convert NLI to structured representation
      const llmResponse = await parseWithModalLLM(input);
      setLlmOutput(JSON.stringify(llmResponse, null, 2));

      if (!llmResponse) {
        throw new Error("Failed to process natural language");
      }

      // Check for challenging commands that should fail
      if (
        input.includes("predict") ||
        input.includes("optimal") ||
        input.includes("arbitrage") ||
        input.includes("impermanent loss") ||
        input.includes("best time")
      ) {
        setLlmError(
          "This type of analysis requires complex calculations and predictions that are beyond the current capabilities. The LLM can only handle historical data and current state analysis.",
        );
        return;
      }

      // Check if it's a data analysis request
      if ("type" in llmResponse) {
        setAnalysisResult(llmResponse);
        return;
      }

      // Handle operation requests
      if (llmResponse.function === "swapExactTokensForTokens") {
        if (!llmResponse.arguments.amountIn || !llmResponse.arguments.tokenIn || !llmResponse.arguments.tokenOut) {
          throw new Error("Missing required arguments for swap");
        }

        // Convert LLM response to our structured representation
        const parsedInstruction: SwapInstruction = {
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

        setSuccessMessage(`Command executed successfully! Please check your wallet for the transaction details.`);
      } else if (llmResponse.function === "addLiquidity") {
        if (
          !llmResponse.arguments.amountADesired ||
          !llmResponse.arguments.tokenA ||
          !llmResponse.arguments.amountBDesired ||
          !llmResponse.arguments.tokenB
        ) {
          throw new Error("Missing required arguments for adding liquidity");
        }

        // Convert LLM response to our structured representation
        const parsedInstruction: AddLiquidityInstruction = {
          type: "addLiquidity",
          tokenA: {
            amount: llmResponse.arguments.amountADesired,
            token: llmResponse.arguments.tokenA,
          },
          tokenB: {
            amount: llmResponse.arguments.amountBDesired,
            token: llmResponse.arguments.tokenB,
          },
        };

        // Step 2: Convert SR to contract call
        const tokenA = getTokenAddress(parsedInstruction.tokenA.token);
        const tokenB = getTokenAddress(parsedInstruction.tokenB.token);
        const amountA = parseAmount(parsedInstruction.tokenA.amount);
        const amountB = parseAmount(parsedInstruction.tokenB.amount);

        if (!routerAddress) {
          throw new Error("Router address not found");
        }

        // Step 3: Execute the contract calls
        // First approve the router to spend both tokens
        await approveToken({
          address: tokenA as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [routerAddress, amountA],
        });

        await approveToken({
          address: tokenB as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [routerAddress, amountB],
        });

        // Wait for approvals
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Then add liquidity
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
        await swapTokens({
          address: routerAddress,
          abi: [
            {
              inputs: [
                { name: "tokenA", type: "address" },
                { name: "tokenB", type: "address" },
                { name: "amountADesired", type: "uint256" },
                { name: "amountBDesired", type: "uint256" },
                { name: "amountAMin", type: "uint256" },
                { name: "amountBMin", type: "uint256" },
                { name: "to", type: "address" },
                { name: "deadline", type: "uint256" },
              ],
              name: "addLiquidity",
              outputs: [
                { name: "amountA", type: "uint256" },
                { name: "amountB", type: "uint256" },
                { name: "liquidity", type: "uint256" },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "addLiquidity",
          args: [
            tokenA,
            tokenB,
            amountA,
            amountB,
            (amountA * BigInt(95)) / BigInt(100), // 5% slippage
            (amountB * BigInt(95)) / BigInt(100), // 5% slippage
            address,
            BigInt(deadline),
          ],
        });

        setSuccessMessage(`Command executed successfully! Please check your wallet for the transaction details.`);
      }
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <select className="select select-bordered w-full mb-2" value={input} onChange={handleCommandSelect}>
              {commonCommands.map((cmd, index) => (
                <option key={index} value={cmd.value}>
                  {cmd.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or type your own command..."
              className="input input-bordered w-full"
              value={input}
              onChange={handleInputChange}
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

        {llmOutput && (
          <div className="mt-4 p-4 bg-base-300 rounded-lg">
            <p className="font-bold mb-2">LLM Output:</p>
            <pre className="text-sm overflow-x-auto">{llmOutput}</pre>
          </div>
        )}

        {llmError && (
          <div className="mt-4 p-4 bg-warning text-warning-content rounded-lg">
            <p className="font-bold">Analysis Limitation:</p>
            <p>{llmError}</p>
          </div>
        )}

        {analysisResult && (
          <div className="mt-4">
            <PoolDataAnalysis
              poolAddress={pools[0].address as `0x${string}`}
              token0={{
                symbol: pools[0].token0.symbol,
                decimals: 18,
              }}
              token1={{
                symbol: pools[0].token1.symbol,
                decimals: 18,
              }}
              analysisRequest={analysisResult}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalLanguageInterface;
