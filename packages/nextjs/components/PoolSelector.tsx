import { useEffect, useState } from "react";
import PoolOperations from "./uniswap/PoolOperations";
import PoolVisualization from "./uniswap/PoolVisualization";
import { formatEther } from "viem";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import { pools } from "~~/configs/pools";

interface Reserves {
  0: bigint;
  1: bigint;
  2: number;
}

const PAIR_ABI = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "_reserve0",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "_reserve1",
        type: "uint112",
      },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const PoolSelector = () => {
  const [selectedPool, setSelectedPool] = useState(pools[0]);
  const [activeTab, setActiveTab] = useState<"deposit" | "redeem" | "swap">("deposit");
  const { address: userAddress } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Read reserves from the selected pool
  const { data: reserves, refetch: refetchReserves } = useContractRead({
    address: selectedPool.address as `0x${string}`,
    abi: PAIR_ABI,
    functionName: "getReserves",
    blockNumber: blockNumber,
  }) as { data: Reserves | undefined; refetch: () => Promise<any> };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatReserves = (amount: bigint) => {
    return parseFloat(formatEther(amount)).toString();
  };

  // Refresh reserves when block number changes
  useEffect(() => {
    refetchReserves();
  }, [blockNumber, refetchReserves]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-3xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">Select a Pool</h2>

      <div className="form-control w-full">
        <select
          className="select select-bordered w-full text-lg"
          value={selectedPool.id}
          onChange={e => setSelectedPool(pools.find(p => p.id === Number(e.target.value)) || pools[0])}
        >
          {pools.map(pool => (
            <option key={pool.id} value={pool.id}>
              Pool {pool.id}: {pool.token0.symbol}-{pool.token1.symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-base-200 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Pool Details</h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-base-content/70">Pool Address:</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20"></div>
              <span className="font-mono">{formatAddress(selectedPool.address)}</span>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => navigator.clipboard.writeText(selectedPool.address)}
              >
                📋
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-base-content/70">Token0:</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20"></div>
              <div className="flex flex-col">
                <span>{selectedPool.token0.name}</span>
                <span className="font-mono text-sm text-base-content/70">
                  {formatAddress(selectedPool.token0.address)}
                </span>
              </div>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => navigator.clipboard.writeText(selectedPool.token0.address)}
              >
                📋
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-base-content/70">Token1:</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20"></div>
              <div className="flex flex-col">
                <span>{selectedPool.token1.name}</span>
                <span className="font-mono text-sm text-base-content/70">
                  {formatAddress(selectedPool.token1.address)}
                </span>
              </div>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => navigator.clipboard.writeText(selectedPool.token1.address)}
              >
                📋
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-base-content/70">Reserves:</span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span>{selectedPool.token0.symbol}:</span>
                <span className="font-mono">{reserves ? formatReserves(reserves[0]) : "Loading..."}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{selectedPool.token1.symbol}:</span>
                <span className="font-mono">{reserves ? formatReserves(reserves[1]) : "Loading..."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add PoolOperations component */}
      <PoolOperations
        poolAddress={selectedPool.address}
        token0={{
          address: selectedPool.token0.address,
          symbol: selectedPool.token0.symbol,
        }}
        token1={{
          address: selectedPool.token1.address,
          symbol: selectedPool.token1.symbol,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Add PoolVisualization component */}
      {reserves && (
        <PoolVisualization
          token0={{
            address: selectedPool.token0.address,
            symbol: selectedPool.token0.symbol,
          }}
          token1={{
            address: selectedPool.token1.address,
            symbol: selectedPool.token1.symbol,
          }}
          reserves={[formatReserves(reserves[0]), formatReserves(reserves[1])]}
          activeTab={activeTab}
          swapFromToken="token0"
          poolAddress={selectedPool.address}
        />
      )}
    </div>
  );
};

export default PoolSelector;
