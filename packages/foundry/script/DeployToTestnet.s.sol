// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/UniswapV2Factory.sol";
import "../contracts/UniswapV2Router02.sol";
import "../contracts/interfaces/IERC20.sol";
import "../contracts/interfaces/IUniswapV2Pair.sol";

contract DeployMyContract is Script {
    // WETH addresses for different networks
    address constant WETH_GOERLI = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
    address constant WETH_SEPOLIA = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
    address constant WETH_MUMBAI = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    address constant WETH_FUJI = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c;
    address constant WETH_MAINNET = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    
    function getWethAddress() public view returns (address) {
        uint256 chainId = block.chainid;
        console.log("Chain ID:", chainId);
        if (chainId == 1) return WETH_MAINNET;
        if (chainId == 5) return WETH_GOERLI;
        if (chainId == 11155111) return WETH_SEPOLIA;
        if (chainId == 80001) return WETH_MUMBAI;
        if (chainId == 43113) return WETH_FUJI;
        return address(0);
    }

    function getMainnetTokens() internal pure returns (address[] memory) {
        address[] memory tokens = new address[](5);
        tokens[0] = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // WETH
        tokens[1] = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // USDC
        tokens[2] = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984; // UNI
        tokens[3] = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // DAI
        tokens[4] = 0x514910771AF9Ca656af840dff83E8264EcF986CA; // LINK
        return tokens;
    }

    function setupInitialLiquidity(
        UniswapV2Router02 router,
        address[] memory tokens,
        address[] memory pairs,
        address deployer
    ) internal {
        uint amountDesired = 5000 * 10**18; // For WETH (18 decimals)
        uint usdcAmountDesired = 5000 * 10**6; // For USDC (6 decimals)
        
        for (uint i = 0; i < pairs.length; i++) {
            uint amount0 = (tokens[i] == 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) ? usdcAmountDesired : amountDesired;
            uint amount1 = (tokens[(i + 1) % tokens.length] == 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) ? usdcAmountDesired : amountDesired;
            
            router.addLiquidity(
                address(tokens[i]),
                address(tokens[(i + 1) % tokens.length]),
                amount0,
                amount1,
                amount0 * 95 / 100,
                amount1 * 95 / 100,
                deployer,
                block.timestamp + 1800
            );
        }
    }

    function testSwap(
        UniswapV2Router02 router,
        IERC20 token0,
        IERC20 token1,
        address deployer
    ) internal {
        uint swapAmount = 100 * 10**18;
        address[] memory path = new address[](2);
        path[0] = address(token0);
        path[1] = address(token1);
        
        uint balanceBefore0 = token0.balanceOf(deployer);
        uint balanceBefore1 = token1.balanceOf(deployer);
        
        router.swapExactTokensForTokens(
            swapAmount,
            0,
            path,
            deployer,
            block.timestamp + 1800
        );
        
        console.log("Swap Test Results:");
        console.log("Token0 spent:", (balanceBefore0 - token0.balanceOf(deployer)) / 10**18);
        console.log("Token1 received:", (token1.balanceOf(deployer) - balanceBefore1) / 10**18);
    }

    function testRedeem(
        UniswapV2Router02 router,
        IERC20 token0,
        IERC20 token1,
        address pair,
        address deployer
    ) internal {
        uint liquidity = IERC20(pair).balanceOf(deployer);
        uint redeemAmount = liquidity / 4;
        
        uint balanceBefore0 = token0.balanceOf(deployer);
        uint balanceBefore1 = token1.balanceOf(deployer);
        
        IERC20(pair).approve(address(router), redeemAmount);
        
        router.removeLiquidity(
            address(token0),
            address(token1),
            redeemAmount,
            0,
            0,
            deployer,
            block.timestamp + 1800
        );
        
        console.log("Redeem Test Results:");
        console.log("Token0 received:", (token0.balanceOf(deployer) - balanceBefore0) / 10**18);
        console.log("Token1 received:", (token1.balanceOf(deployer) - balanceBefore1) / 10**18);
        console.log("Liquidity tokens burned:", redeemAmount / 10**18);
    }

    function run() external {
        address deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        // Deploy WETH if needed
        address wethAddress = getWethAddress();

        // Deploy core contracts
        UniswapV2Factory factory = new UniswapV2Factory(deployer);
        UniswapV2Router02 router = new UniswapV2Router02(address(factory), wethAddress);

        // Create and setup tokens
        // TestERC20[] memory tokens = createAndSetupTokens();
        // for (uint i = 0; i < tokens.length; i++) {
        //     // tokens[i].mint(deployer, 10000 * 10**18);
        //     tokens[i].approve(address(router), type(uint256).max);
        // }

        // Use existing tokens
        address[] memory tokens = getMainnetTokens();

        // You must manually approve tokens on-chain beforehand
        for (uint i = 0; i < tokens.length; i++) {
            // Special handling for USDT
            if (tokens[i] == 0xdAC17F958D2ee523a2206206994597C13D831ec7) {
                // First set allowance to 0
                IERC20(tokens[i]).approve(address(router), 0);
                // Then set to a large but reasonable amount (1 billion USDT)
                IERC20(tokens[i]).approve(address(router), 1_000_000_000 * 10**6);
            } else {
                IERC20(tokens[i]).approve(address(router), type(uint256).max);
            }
        }

        // Create pairs
        address[] memory pairs = new address[](5);
        pairs[0] = factory.createPair(tokens[0], tokens[1]);
        pairs[1] = factory.createPair(tokens[1], tokens[2]);
        pairs[2] = factory.createPair(tokens[2], tokens[3]);
        pairs[3] = factory.createPair(tokens[3], tokens[4]);
        pairs[4] = factory.createPair(tokens[0], tokens[4]);

        // Log addresses
        console.log("\n=== Deployed Contract Addresses ===");
        console.log("WETH address:", wethAddress);
        console.log("Factory address:", address(factory));
        console.log("Router address:", address(router));

        // console.log("\n=== Token Addresses ===");
        // for (uint i = 0; i < tokens.length; i++) {
        //     console.log("%s: %s", tokens[i].symbol(), address(tokens[i]));
        // }

        // Debug logs for USDC
        console.log("\n=== USDC Debug Info ===");
        console.log("USDC Address:", tokens[1]);
        console.log("USDC Balance:", IERC20(tokens[1]).balanceOf(deployer));
        console.log("USDC Allowance:", IERC20(tokens[1]).allowance(deployer, address(router)));
        console.log("USDC Name:", IERC20(tokens[1]).name());
        console.log("USDC Symbol:", IERC20(tokens[1]).symbol());
        console.log("USDC Decimals:", IERC20(tokens[1]).decimals());

        // Add initial liquidity
        setupInitialLiquidity(router, tokens, pairs, deployer);

        console.log("\n=== Pool reserves ===");
        for (uint i = 0; i < pairs.length; i++) {
            (uint112 reserve0, uint112 reserve1,) = IUniswapV2Pair(pairs[i]).getReserves();
            console.log("Pool %d: %s", i + 1, pairs[i]);
            console.log("  Token0: %s", address(tokens[i]));
            console.log("  Token1: %s", address(tokens[(i + 1) % tokens.length]));
            console.log("  Reserve0: %d", reserve0 / 1e18);
            console.log("  Reserve1: %d", reserve1 / 1e18);
            console.log("---");
        }

        // // Test swap
        // testSwap(router, tokens[0], tokens[1], deployer);

        // // Test redeem
        // testRedeem(router, tokens[0], tokens[1], pairs[0], deployer);

        vm.stopBroadcast();
    }
}