// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/UniswapV2Factory.sol";
import "../contracts/UniswapV2Router02.sol";
import "../contracts/interfaces/IERC20.sol";
import "../contracts/test/TestERC20.sol";
import "../contracts/test/WETH9.sol";

contract DeployMyContract is Script {
    // WETH addresses for different networks
    address constant WETH_GOERLI = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
    address constant WETH_SEPOLIA = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
    address constant WETH_MUMBAI = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    address constant WETH_FUJI = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c;

    // Struct to store token information
    struct TokenInfo {
        string name;
        string symbol;
        address tokenAddress;
    }

    // Struct to store pair information
    struct PairInfo {
        address token0;
        address token1;
        address pairAddress;
    }

    function run() external {
        // Get the WETH address based on the current network
        address wethAddress;
        uint256 chainId = block.chainid;
        
        if (chainId == 5) { // Goerli
            wethAddress = WETH_GOERLI;
        } else if (chainId == 11155111) { // Sepolia
            wethAddress = WETH_SEPOLIA;
        } else if (chainId == 80001) { // Mumbai
            wethAddress = WETH_MUMBAI;
        } else if (chainId == 43113) { // Fuji
            wethAddress = WETH_FUJI;
        } else {
            // For local development, deploy a new WETH
            WETH9 weth = new WETH9();
            wethAddress = address(weth);
            console.log("WETH deployed at:", wethAddress);
        }
        
        // Get the deployer address
        address deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        console.log("Deployer address:", deployer);
        
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        
        // Deploy Factory
        UniswapV2Factory factory = new UniswapV2Factory(deployer);
        
        // Deploy Router with WETH address
        UniswapV2Router02 router = new UniswapV2Router02(address(factory), wethAddress);

        // Create tokens
        TokenInfo[] memory tokens = new TokenInfo[](5);
        tokens[0] = TokenInfo("Token A", "TKNA", address(new TestERC20("Token A", "TKNA", 18)));
        tokens[1] = TokenInfo("Token B", "TKNB", address(new TestERC20("Token B", "TKNB", 18)));
        tokens[2] = TokenInfo("Token C", "TKNC", address(new TestERC20("Token C", "TKNC", 18)));
        tokens[3] = TokenInfo("Token D", "TKND", address(new TestERC20("Token D", "TKND", 18)));
        tokens[4] = TokenInfo("Token E", "TKNE", address(new TestERC20("Token E", "TKNE", 18)));

        // Create pairs
        PairInfo[] memory pairs = new PairInfo[](5);
        pairs[0] = PairInfo(tokens[0].tokenAddress, tokens[1].tokenAddress, factory.createPair(tokens[0].tokenAddress, tokens[1].tokenAddress));
        pairs[1] = PairInfo(tokens[1].tokenAddress, tokens[2].tokenAddress, factory.createPair(tokens[1].tokenAddress, tokens[2].tokenAddress));
        pairs[2] = PairInfo(tokens[2].tokenAddress, tokens[3].tokenAddress, factory.createPair(tokens[2].tokenAddress, tokens[3].tokenAddress));
        pairs[3] = PairInfo(tokens[3].tokenAddress, tokens[4].tokenAddress, factory.createPair(tokens[3].tokenAddress, tokens[4].tokenAddress));
        pairs[4] = PairInfo(tokens[0].tokenAddress, tokens[4].tokenAddress, factory.createPair(tokens[0].tokenAddress, tokens[4].tokenAddress));

        // Log all deployed addresses
        console.log("\n=== Deployed Contract Addresses ===");
        console.log("WETH address:", wethAddress);
        console.log("Factory address:", address(factory));
        console.log("Router address:", address(router));

        console.log("\n=== Token Addresses ===");
        for (uint i = 0; i < tokens.length; i++) {
            console.log("%s (%s): %s", tokens[i].name, tokens[i].symbol, tokens[i].tokenAddress);
        }

        console.log("\n=== Trading Pairs ===");
        for (uint i = 0; i < pairs.length; i++) {
            console.log("Pair %d: %s - %s", i + 1, pairs[i].token0, pairs[i].token1);
            console.log("Pair address:", pairs[i].pairAddress);
        }

        // Mint tokens to deployer
        // for (uint i = 0; i < tokens.length; i++) {
        //     TestERC20(tokens[i].tokenAddress).mint(deployer, 10000 * 10**18);
        // }

        // Approve router to spend tokens
        console.log("\n=== Approving Router ===");
        for (uint i = 0; i < tokens.length; i++) {
            TestERC20(tokens[i].tokenAddress).approve(address(router), type(uint256).max);
            console.log("Approved %s for router", tokens[i].name);
        }

        // Add liquidity to pairs
        console.log("\n=== Adding Liquidity to Pairs ===");
        for (uint i = 0; i < pairs.length; i++) {
            uint amountDesired = 5000 * 10**18;
            router.addLiquidity(
                pairs[i].token0,
                pairs[i].token1,
                amountDesired,
                amountDesired,
                amountDesired * 95 / 100,
                amountDesired * 95 / 100,
                deployer,
                block.timestamp + 1800
            );
            console.log("Added liquidity to pair %d", i + 1);
        }

        // Log final balances
        console.log("\n=== Final Balances ===");
        for (uint i = 0; i < tokens.length; i++) {
            console.log("%s balance:", tokens[i].name);
            console.log("Deployer balance:", TestERC20(tokens[i].tokenAddress).balanceOf(deployer));
            console.log("Total supply:", TestERC20(tokens[i].tokenAddress).totalSupply());
        }

        vm.stopBroadcast();
    }
}