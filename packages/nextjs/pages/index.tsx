import { useEffect } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import PoolSelector from "~~/components/PoolSelector";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">Uniswap V2 Pool Explorer</span>
          </h1>
          <PoolSelector />
        </div>
      </div>
    </>
  );
};

export default Home;
