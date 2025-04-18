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
        // Using actual Sepolia testnet tokens
        tokens[0] = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9; // WETH
        tokens[1] = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // USDC
        tokens[2] = 0x779877A7B0D9E8603169DdbD7836e478b4624789; // LINK
        tokens[3] = 0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6; // DAI
        tokens[4] = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984; // UNI
        return tokens;
    }

    function setupInitialLiquidity(
        UniswapV2Router02 router,
        address[] memory tokens,
        address[] memory pairs,
        address deployer
    ) internal {
        uint amountDesired = 1 * 10**18; // 1 WETH for testnet
        uint usdcAmountDesired = 1000 * 10**6; // 1000 USDC for testnet
        
        for (uint i = 0; i < pairs.length; i++) {
            // Check token balances before adding liquidity
            uint balance0 = IERC20(tokens[i]).balanceOf(deployer);
            uint balance1 = IERC20(tokens[(i + 1) % tokens.length]).balanceOf(deployer);
            
            if (balance0 < amountDesired || balance1 < amountDesired) {
                console.log("Skipping pair", i, "due to insufficient balance");
                console.log("Token0 balance:", balance0);
                console.log("Token1 balance:", balance1);
                continue;
            }

            uint amount0 = (tokens[i] == 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238) ? usdcAmountDesired : amountDesired;
            uint amount1 = (tokens[(i + 1) % tokens.length] == 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238) ? usdcAmountDesired : amountDesired;
            
            try router.addLiquidity(
                address(tokens[i]),
                address(tokens[(i + 1) % tokens.length]),
                amount0,
                amount1,
                amount0 * 95 / 100,
                amount1 * 95 / 100,
                deployer,
                block.timestamp + 1800
            ) {
                console.log("Successfully added liquidity for pair", i);
            } catch Error(string memory reason) {
                console.log("Failed to add liquidity for pair", i, ":", reason);
            } catch {
                console.log("Failed to add liquidity for pair", i, ": unknown error");
            }
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
        require(wethAddress != address(0), "WETH address not found for this network");

        // Deploy core contracts
        UniswapV2Factory factory = new UniswapV2Factory(deployer);
        UniswapV2Router02 router = new UniswapV2Router02(address(factory), wethAddress);

        // Log deployed addresses
        console.log("\n=== Deployed Contract Addresses ===");
        console.log("WETH address:", wethAddress);
        console.log("Factory address:", address(factory));
        console.log("Router address:", address(router));

        // Use existing tokens
        address[] memory tokens = getMainnetTokens();

        // Log token balances before approval
        console.log("\n=== Token Balances Before Approval ===");
        for (uint i = 0; i < tokens.length; i++) {
            try IERC20(tokens[i]).balanceOf(deployer) returns (uint balance) {
                console.log("Token", i, "balance:", balance);
            } catch {
                console.log("Failed to get balance for token", i);
            }
        }

        // Approve tokens with error handling
        console.log("\n=== Token Approvals ===");
        for (uint i = 0; i < tokens.length; i++) {
            try IERC20(tokens[i]).approve(address(router), type(uint256).max) {
                console.log("Successfully approved token", i);
            } catch Error(string memory reason) {
                console.log("Failed to approve token", i, ":", reason);
            } catch {
                console.log("Failed to approve token", i, ": unknown error");
            }
        }

        // Create pairs with error handling
        console.log("\n=== Creating Pairs ===");
        address[] memory pairs = new address[](5);
        for (uint i = 0; i < tokens.length; i++) {
            try factory.createPair(tokens[i], tokens[(i + 1) % tokens.length]) {
                pairs[i] = factory.getPair(tokens[i], tokens[(i + 1) % tokens.length]);
                console.log("Created pair", i, "at address:", pairs[i]);
            } catch Error(string memory reason) {
                console.log("Failed to create pair", i, ":", reason);
            } catch {
                console.log("Failed to create pair", i, ": unknown error");
            }
        }

        vm.stopBroadcast();
    }
}