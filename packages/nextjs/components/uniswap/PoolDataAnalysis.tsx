import React, { useEffect, useState } from "react";
import { parseAbiItem } from "viem";
import { formatEther } from "viem";
import { usePublicClient } from "wagmi";

interface PoolDataAnalysisProps {
  poolAddress: `0x${string}`;
  token0: {
    symbol: string;
    decimals: number;
  };
  token1: {
    symbol: string;
    decimals: number;
  };
  analysisRequest: any;
}

interface AnalysisResult {
  type: string;
  data: any;
  loading: boolean;
  error?: string;
}

const PoolDataAnalysis: React.FC<PoolDataAnalysisProps> = ({ poolAddress, token0, token1, analysisRequest }) => {
  const publicClient = usePublicClient();
  const [result, setResult] = useState<AnalysisResult>({
    type: "",
    data: null,
    loading: false,
  });

  const fetchReserves = async () => {
    if (!publicClient) throw new Error("Public client not available");
    try {
      const reserves = await publicClient.readContract({
        address: poolAddress,
        abi: [
          {
            inputs: [],
            name: "getReserves",
            outputs: [
              { name: "_reserve0", type: "uint112" },
              { name: "_reserve1", type: "uint112" },
              { name: "_blockTimestampLast", type: "uint32" },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getReserves",
      });

      return {
        reserve0: formatEther(reserves[0]),
        reserve1: formatEther(reserves[1]),
        timestamp: reserves[2],
      };
    } catch (error) {
      console.error("Error fetching reserves:", error);
      throw error;
    }
  };

  const fetchSwaps = async (timeframe: string) => {
    if (!publicClient) throw new Error("Public client not available");
    try {
      const now = Math.floor(Date.now() / 1000);
      let fromBlock = 0;

      if (timeframe === "today") {
        fromBlock = now - 86400; // 24 hours
      } else if (timeframe === "24h") {
        fromBlock = now - 86400;
      }

      const logs = await publicClient.getLogs({
        address: poolAddress,
        event: parseAbiItem(
          "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)",
        ),
        fromBlock: BigInt(fromBlock),
        toBlock: "latest",
      });

      return {
        count: logs.length,
        swaps: logs.map(log => ({
          amount0In: formatEther(log.args.amount0In || 0n),
          amount1In: formatEther(log.args.amount1In || 0n),
          amount0Out: formatEther(log.args.amount0Out || 0n),
          amount1Out: formatEther(log.args.amount1Out || 0n),
        })),
      };
    } catch (error) {
      console.error("Error fetching swaps:", error);
      throw error;
    }
  };

  const fetchPriceHistory = async (period: string) => {
    if (!publicClient) throw new Error("Public client not available");
    try {
      const now = Math.floor(Date.now() / 1000);
      let fromBlock = 0;

      if (period === "week") {
        fromBlock = now - 604800; // 7 days
      } else if (period === "day") {
        fromBlock = now - 86400;
      } else if (period === "hour") {
        fromBlock = now - 3600;
      } else if (period === "month") {
        fromBlock = now - 2592000; // 30 days
      }

      const logs = await publicClient.getLogs({
        address: poolAddress,
        event: parseAbiItem(
          "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)",
        ),
        fromBlock: BigInt(fromBlock),
        toBlock: "latest",
      });

      const prices = logs.map(log => {
        const reserve0 = BigInt(log.args.amount0In || 0n) + BigInt(log.args.amount0Out || 0n);
        const reserve1 = BigInt(log.args.amount1In || 0n) + BigInt(log.args.amount1Out || 0n);
        return {
          timestamp: Number(log.blockNumber),
          price: reserve1 > 0n ? Number(reserve0) / Number(reserve1) : 0,
        };
      });

      return {
        period,
        prices,
      };
    } catch (error) {
      console.error("Error fetching price history:", error);
      throw error;
    }
  };

  const calculatePriceImpact = async (amount: string, token: string) => {
    try {
      const reserves = await fetchReserves();
      const amountIn = BigInt(parseFloat(amount) * 10 ** 18);

      let priceImpact = 0;
      if (token === token0.symbol) {
        const newReserve0 = BigInt(parseFloat(reserves.reserve0) * 10 ** 18) + amountIn;
        const newReserve1 = BigInt(parseFloat(reserves.reserve1) * 10 ** 18);
        const newPrice = Number(newReserve0) / Number(newReserve1);
        const oldPrice =
          Number(BigInt(parseFloat(reserves.reserve0) * 10 ** 18)) /
          Number(BigInt(parseFloat(reserves.reserve1) * 10 ** 18));
        priceImpact = ((newPrice - oldPrice) / oldPrice) * 100;
      } else {
        const newReserve0 = BigInt(parseFloat(reserves.reserve0) * 10 ** 18);
        const newReserve1 = BigInt(parseFloat(reserves.reserve1) * 10 ** 18) + amountIn;
        const newPrice = Number(newReserve1) / Number(newReserve0);
        const oldPrice =
          Number(BigInt(parseFloat(reserves.reserve1) * 10 ** 18)) /
          Number(BigInt(parseFloat(reserves.reserve0) * 10 ** 18));
        priceImpact = ((newPrice - oldPrice) / oldPrice) * 100;
      }

      return {
        amount,
        token,
        priceImpact: priceImpact.toFixed(2) + "%",
      };
    } catch (error) {
      console.error("Error calculating price impact:", error);
      throw error;
    }
  };

  useEffect(() => {
    const handleAnalysisRequest = async () => {
      if (!analysisRequest) return;

      setResult({ type: analysisRequest.type, data: null, loading: true });

      try {
        let data;
        switch (analysisRequest.type) {
          case "reserves":
            data = await fetchReserves();
            break;
          case "swaps":
            data = await fetchSwaps(analysisRequest.timeframe || "today");
            break;
          case "price":
            const reserves = await fetchReserves();
            data = {
              price: Number(reserves.reserve0) / Number(reserves.reserve1),
            };
            break;
          case "price_history":
            data = await fetchPriceHistory(analysisRequest.period || "week");
            break;
          case "liquidity":
            const liquidityReserves = await fetchReserves();
            data = {
              totalLiquidity: Number(liquidityReserves.reserve0) * Number(liquidityReserves.reserve1),
            };
            break;
          case "volume":
            const volumeData = await fetchSwaps(analysisRequest.timeframe || "24h");
            data = {
              volume: volumeData.swaps.reduce((acc, swap) => {
                return acc + Number(swap.amount0In) + Number(swap.amount1In);
              }, 0),
              count: volumeData.count,
            };
            break;
          case "price_impact":
            data = await calculatePriceImpact(analysisRequest.amount, analysisRequest.token);
            break;
          default:
            throw new Error("Unsupported analysis type");
        }

        setResult({ type: analysisRequest.type, data, loading: false });
      } catch (error) {
        setResult({
          type: analysisRequest.type,
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        });
      }
    };

    handleAnalysisRequest();
  }, [analysisRequest, poolAddress, publicClient, token0.symbol, token1.symbol]);

  if (!analysisRequest) return null;

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Analysis Results</h3>
      {result.loading ? (
        <div className="flex items-center">
          <span className="loading loading-spinner loading-sm mr-2"></span>
          <span>Loading analysis...</span>
        </div>
      ) : result.error ? (
        <div className="text-error">{result.error}</div>
      ) : (
        <div className="space-y-2">
          {result.type === "reserves" && (
            <>
              <p>
                Token0 ({token0.symbol}) Reserves: {result.data.reserve0}
              </p>
              <p>
                Token1 ({token1.symbol}) Reserves: {result.data.reserve1}
              </p>
            </>
          )}
          {result.type === "swaps" && (
            <>
              <p>Total Swaps: {result.data.count}</p>
              <p>
                Average Swap Size:{" "}
                {(
                  result.data.swaps.reduce(
                    (acc: number, swap: any) => acc + Number(swap.amount0In) + Number(swap.amount1In),
                    0,
                  ) / result.data.count
                ).toFixed(4)}
              </p>
            </>
          )}
          {result.type === "price" && (
            <p>
              Current Price: 1 {token1.symbol} = {result.data.price.toFixed(6)} {token0.symbol}
            </p>
          )}
          {result.type === "price_history" && (
            <>
              <p>Price History ({result.data.period}):</p>
              <div className="max-h-40 overflow-y-auto">
                {result.data.prices.map((price: any, index: number) => (
                  <div key={index} className="text-sm">
                    {new Date(price.timestamp * 1000).toLocaleString()}: {price.price.toFixed(6)}
                  </div>
                ))}
              </div>
            </>
          )}
          {result.type === "liquidity" && (
            <p>
              Total Liquidity: {result.data.totalLiquidity.toFixed(2)} {token0.symbol}-{token1.symbol}
            </p>
          )}
          {result.type === "volume" && (
            <>
              <p>
                24h Volume: {result.data.volume.toFixed(2)} {token0.symbol}-{token1.symbol}
              </p>
              <p>Number of Trades: {result.data.count}</p>
            </>
          )}
          {result.type === "price_impact" && (
            <p>
              Price Impact for swapping {result.data.amount} {result.data.token}: {result.data.priceImpact}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolDataAnalysis;
