import { useState } from "react";
import { getContract, parseEther, parseUnits } from "viem";
import { useAccount, useReadContract, useWalletClient, useWriteContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PoolOperationsProps {
  poolAddress: string;
  token0: {
    address: string;
    symbol: string;
  };
  token1: {
    address: string;
    symbol: string;
  };
  activeTab: "deposit" | "redeem" | "swap";
  onTabChange: (tab: "deposit" | "redeem" | "swap") => void;
}

// ERC20 ABI（balanceOf + approve）
const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];

const PoolOperations = ({ poolAddress, token0, token1, activeTab, onTabChange }: PoolOperationsProps) => {
  const { address: connectedAddress } = useAccount();
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [loading, setLoading] = useState(false);
  const [swapDirection, setSwapDirection] = useState<"token0ToToken1" | "token1ToToken0">("token0ToToken1");

  const { data: routerInfo } = useDeployedContractInfo("UniswapV2Router02");
  const routerAddress = routerInfo?.address;

  const { writeContract: approveToken0 } = useWriteContract();
  const { writeContract: approveToken1 } = useWriteContract();
  const { writeContract: addLiquidity } = useWriteContract();
  const { writeContract: removeLiquidity } = useWriteContract();
  const { writeContract: swapExactTokensForTokens } = useWriteContract();
  const { writeContract: approveLP } = useWriteContract();

  const { data: lpBalance } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [connectedAddress],
  }) as { data: bigint | undefined };

  const handleDeposit = async () => {
    if (!amount0 || !amount1 || !connectedAddress || !routerAddress) return;

    setLoading(true);
    try {
      // Approve token0
      await approveToken0({
        address: token0.address as `0x${string}`,
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
        args: [routerAddress, parseEther(amount0)],
      });

      // Approve token1
      await approveToken1({
        address: token1.address as `0x${string}`,
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
        args: [routerAddress, parseEther(amount1)],
      });

      // Wait for approvals
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Add liquidity
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
          token0.address,
          token1.address,
          parseEther(amount0),
          parseEther(amount1),
          (parseEther(amount0) * BigInt(95)) / BigInt(100), // 5% slippage
          (parseEther(amount1) * BigInt(95)) / BigInt(100), // 5% slippage
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

  const handleRedeem = async () => {
    if (!amount0 || !connectedAddress || !routerAddress || !lpBalance) return;
    setLoading(true);
    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      // Convert user input to LP token amount
      const redeemAmount = parseUnits(amount0, 18);

      // Check if user has enough LP tokens
      if (redeemAmount > lpBalance) {
        throw new Error("Not enough LP tokens to redeem");
      }

      // Approve router to spend LP tokens
      await approveLP({
        address: poolAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [routerAddress, redeemAmount],
      });

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Remove liquidity
      await removeLiquidity({
        address: routerAddress,
        abi: [
          {
            inputs: [
              { name: "tokenA", type: "address" },
              { name: "tokenB", type: "address" },
              { name: "liquidity", type: "uint256" },
              { name: "amountAMin", type: "uint256" },
              { name: "amountBMin", type: "uint256" },
              { name: "to", type: "address" },
              { name: "deadline", type: "uint256" },
            ],
            name: "removeLiquidity",
            outputs: [
              { name: "amountA", type: "uint256" },
              { name: "amountB", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "removeLiquidity",
        args: [
          token0.address,
          token1.address,
          redeemAmount,
          parseEther("0"), // 0% slippage
          parseEther("0"), // 0% slippage
          connectedAddress,
          BigInt(deadline),
        ],
      });
    } catch (error) {
      console.error("Error removing liquidity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!amount0 || !connectedAddress || !routerAddress) return;

    setLoading(true);
    try {
      const fromToken = swapDirection === "token0ToToken1" ? token0 : token1;
      const toToken = swapDirection === "token0ToToken1" ? token1 : token0;

      // Approve token for swap
      await approveToken0({
        address: fromToken.address as `0x${string}`,
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
        args: [routerAddress, parseEther(amount0)],
      });

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Perform swap
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      await swapExactTokensForTokens({
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
          parseEther(amount0),
          (parseEther(amount0) * BigInt(95)) / BigInt(100), // 5% slippage
          [fromToken.address, toToken.address],
          connectedAddress,
          BigInt(deadline),
        ],
      });
    } catch (error) {
      console.error("Error swapping tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow-md">
      <div className="tabs tabs-boxed mb-6">
        <button className={`tab ${activeTab === "deposit" ? "tab-active" : ""}`} onClick={() => onTabChange("deposit")}>
          Deposit
        </button>
        <button className={`tab ${activeTab === "redeem" ? "tab-active" : ""}`} onClick={() => onTabChange("redeem")}>
          Redeem
        </button>
        <button className={`tab ${activeTab === "swap" ? "tab-active" : ""}`} onClick={() => onTabChange("swap")}>
          Swap
        </button>
      </div>

      {activeTab === "deposit" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{token0.symbol} Amount</label>
            <input
              type="text"
              value={amount0}
              onChange={e => setAmount0(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{token1.symbol} Amount</label>
            <input
              type="text"
              value={amount1}
              onChange={e => setAmount1(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0.0"
            />
          </div>
          <button
            onClick={handleDeposit}
            disabled={loading}
            className={`w-full py-2 px-4 rounded ${
              loading ? "bg-gray-400" : "bg-primary hover:bg-primary-focus"
            } text-white`}
          >
            {loading ? "Processing..." : "Add Liquidity"}
          </button>
        </div>
      )}

      {activeTab === "redeem" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Liquidity Amount</label>
            <input
              type="text"
              value={amount0}
              onChange={e => setAmount0(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0.0"
            />
          </div>
          <button
            onClick={handleRedeem}
            disabled={loading}
            className={`w-full py-2 px-4 rounded ${
              loading ? "bg-gray-400" : "bg-primary hover:bg-primary-focus"
            } text-white`}
          >
            {loading ? "Processing..." : "Remove Liquidity"}
          </button>
        </div>
      )}

      {activeTab === "swap" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Swap Direction:</span>
            <div className="flex items-center space-x-2">
              <button
                className={`btn btn-sm ${swapDirection === "token0ToToken1" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSwapDirection("token0ToToken1")}
              >
                {token0.symbol} → {token1.symbol}
              </button>
              <button
                className={`btn btn-sm ${swapDirection === "token1ToToken0" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSwapDirection("token1ToToken0")}
              >
                {token1.symbol} → {token0.symbol}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Amount to Swap ({swapDirection === "token0ToToken1" ? token0.symbol : token1.symbol})
            </label>
            <input
              type="text"
              value={amount0}
              onChange={e => setAmount0(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0.0"
            />
          </div>

          <div className="text-sm text-base-content/70">
            <p>You will receive {swapDirection === "token0ToToken1" ? token1.symbol : token0.symbol} tokens</p>
          </div>

          <button
            onClick={handleSwap}
            disabled={loading}
            className={`w-full py-2 px-4 rounded ${
              loading ? "bg-gray-400" : "bg-primary hover:bg-primary-focus"
            } text-white`}
          >
            {loading ? "Processing..." : "Swap Tokens"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PoolOperations;
