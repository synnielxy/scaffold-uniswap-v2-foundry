import React from "react";
import PoolReservesChart from "./PoolReservesChart";

interface TokenInfo {
  address: string;
  symbol: string;
  decimals?: number;
}

interface PoolVisualizationProps {
  token0: TokenInfo;
  token1: TokenInfo;
  reserves: [string, string];
  activeTab: "deposit" | "redeem" | "swap";
  swapFromToken: "token0" | "token1";
  isLoading?: boolean;
  poolAddress: string;
}

const PoolVisualization: React.FC<PoolVisualizationProps> = ({ token0, token1, reserves, isLoading = false }) => {
  // Format reserves for display - convert from raw amounts to humanized amounts
  const formatReserve = (reserve: string, decimals = 18) => {
    if (!reserve) return "0";
    try {
      // Handle the case where reserve is already a decimal string
      if (reserve.includes(".")) {
        return reserve;
      }

      // If it's a whole number string, format it with decimals
      const amount = BigInt(reserve);
      const divisor = BigInt(10) ** BigInt(decimals);
      const integerPart = amount / divisor;
      const decimalPart = amount % divisor;

      // Format with up to 6 decimal places
      const decimalStr = decimalPart.toString().padStart(decimals, "0");
      const truncatedDecimal = decimalStr.substring(0, 6).replace(/0+$/, "");

      return truncatedDecimal ? `${integerPart}.${truncatedDecimal}` : integerPart.toString();
    } catch (error) {
      // If conversion fails, return the number as is
      return reserve;
    }
  };

  const humanizedReserve0 = formatReserve(reserves[0], token0.decimals);
  const humanizedReserve1 = formatReserve(reserves[1], token1.decimals);

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 flex justify-between items-center">
        Pool Visualization
        {isLoading && (
          <div className="flex items-center">
            <span className="loading loading-spinner loading-sm mr-2"></span>
            <span className="text-sm font-normal">Refreshing...</span>
          </div>
        )}
      </h3>

      <div className="mb-6">
        <h4 className="text-lg mb-2">Constant Product Curve</h4>
        <p className="text-sm text-base-content/70 mb-4">
          This chart shows the constant product curve (x * y = k) for the current pool, where k ={" "}
          {(parseFloat(humanizedReserve0) * parseFloat(humanizedReserve1)).toFixed(4)}. The current position (P) is
          marked in red.
        </p>
        <PoolReservesChart
          token0Symbol={token0.symbol}
          token1Symbol={token1.symbol}
          reserve0={humanizedReserve0}
          reserve1={humanizedReserve1}
        />
      </div>

      <div className="text-sm">
        <h4 className="font-medium mb-1">Current Reserves:</h4>
        <ul className="list-disc list-inside">
          <li>
            {humanizedReserve0} {token0.symbol}
          </li>
          <li>
            {humanizedReserve1} {token1.symbol}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PoolVisualization;
