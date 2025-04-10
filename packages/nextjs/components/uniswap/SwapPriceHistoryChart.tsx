import React, { useEffect, useState } from "react";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SwapEvent {
  price: number;
  timestamp: number;
  amount0In: number;
  amount1In: number;
  amount0Out: number;
  amount1Out: number;
}

interface SwapPriceHistoryChartProps {
  token0Symbol: string;
  token1Symbol: string;
  poolAddress: `0x${string}`;
}

const SwapPriceHistoryChart: React.FC<SwapPriceHistoryChartProps> = ({ token0Symbol, token1Symbol, poolAddress }) => {
  const [swapEvents, setSwapEvents] = useState<SwapEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchSwapEvents = async () => {
      if (!publicClient) {
        console.log("No public client available");
        setIsLoading(false);
        return;
      }

      try {
        // Get the current block number
        const currentBlock = await publicClient.getBlockNumber();

        // Query all blocks from the beginning
        const fromBlock = BigInt(0);

        // Get logs for Swap events
        const logs = await publicClient.getLogs({
          address: poolAddress,
          fromBlock,
          toBlock: currentBlock,
          event: parseAbiItem(
            "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)",
          ),
        });

        const events = await Promise.all(
          logs.map(async log => {
            try {
              // Get reserves at the time of the swap
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
                blockNumber: log.blockNumber,
              });

              const args = log.args;

              if (!args) {
                console.log("No args found in log");
                return null;
              }

              const { amount0In, amount1In, amount0Out, amount1Out } = args;
              console.log("Swap amounts:", { amount0In, amount1In, amount0Out, amount1Out });

              // Calculate price based on reserves
              const price = reserves[0] > 0 ? Number(reserves[1]) / Number(reserves[0]) : 0;
              console.log("Calculated price:", price);

              return {
                price,
                timestamp: Number(log.blockNumber),
                amount0In: Number(amount0In),
                amount1In: Number(amount1In),
                amount0Out: Number(amount0Out),
                amount1Out: Number(amount1Out),
              };
            } catch (error) {
              console.error("Error processing log:", error);
              return null;
            }
          }),
        );

        const validEvents = events.filter((event): event is SwapEvent => event !== null);
        setSwapEvents(validEvents);
      } catch (error) {
        console.error("Error fetching swap events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwapEvents();
  }, [poolAddress, publicClient]);

  const chartData = {
    labels: swapEvents.map(event => `Block ${event.timestamp}`),
    datasets: [
      {
        label: `Price (${token1Symbol}/${token0Symbol})`,
        data: swapEvents.map(event => event.price),
        backgroundColor: "rgba(136, 132, 216, 0.5)",
        borderColor: "rgba(136, 132, 216, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Swap Price History",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `Price (${token1Symbol}/${token0Symbol})`,
        },
      },
    },
  };

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4">Swap Price History</h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : swapEvents.length === 0 ? (
        <div className="text-center py-8">
          <p>No swap history available for this pool</p>
        </div>
      ) : (
        <div style={{ height: "400px", width: "100%" }}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default SwapPriceHistoryChart;