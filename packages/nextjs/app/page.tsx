"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PoolSelector from "~~/components/PoolSelector";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";


const Home: NextPage = () => {
  const { data: routerInfo } = useDeployedContractInfo("UniswapV2Router02");

  const routerAddress = routerInfo?.address;

  const { address: connectedAddress } = useAccount();
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [loading, setLoading] = useState(false);

  // Get pool count from factory
  const { data: allPairsLength } = useScaffoldReadContract({
    contractName: "UniswapV2Factory",
    functionName: "allPairsLength",
  });

  const { writeContract: approveTokenA } = useWriteContract();
  const { writeContract: approveTokenB } = useWriteContract();
  const { writeContract: addLiquidity } = useWriteContract();

  const handleAddLiquidity = async () => {
    if (!tokenA || !tokenB || !amountA || !amountB || !connectedAddress) return;

    setLoading(true);
    try {
      // First approve token A
      await approveTokenA({
        address: tokenA as `0x${string}`,
        abi: [
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
        ],
        functionName: "approve",
        args: [routerAddress as `0x${string}`, parseEther(amountA)],
      });

      // Then approve token B
      await approveTokenB({
        address: tokenB as `0x${string}`,
        abi: [
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
        ],
        functionName: "approve",
        args: [routerAddress, parseEther(amountB)],
      });

      // Wait for approvals to be confirmed
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Now add liquidity
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      await addLiquidity({
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
          parseEther(amountA),
          parseEther(amountB),
          (parseEther(amountA) * BigInt(95)) / BigInt(100), // 5% slippage
          (parseEther(amountB) * BigInt(95)) / BigInt(100), // 5% slippage
          connectedAddress,
          BigInt(deadline),
        ],
      });
    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Uniswap V2 Pool Explorer</span>
        </h1>

        {/* Pool Selector Section */}
        <div className="mb-8">
          <PoolSelector />
        </div>

        {/* Add Liquidity Section */}
        <div className="mt-8 p-6 bg-base-200 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Add Liquidity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Token A Address</label>
              <input
                type="text"
                value={tokenA}
                onChange={e => setTokenA(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Token B Address</label>
              <input
                type="text"
                value={tokenB}
                onChange={e => setTokenB(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount A</label>
              <input
                type="text"
                value={amountA}
                onChange={e => setAmountA(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount B</label>
              <input
                type="text"
                value={amountB}
                onChange={e => setAmountB(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0.0"
              />
            </div>
            <button
              onClick={handleAddLiquidity}
              disabled={loading}
              className={`w-full py-2 px-4 rounded ${
                loading ? "bg-gray-400" : "bg-primary hover:bg-primary-focus"
              } text-white`}
            >
              {loading ? "Processing..." : "Add Liquidity"}
            </button>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;