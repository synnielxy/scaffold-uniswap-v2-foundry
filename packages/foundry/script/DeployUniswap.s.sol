// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/UniswapV2Factory.sol";
import "../contracts/UniswapV2Router02.sol";
import "../contracts/interfaces/IERC20.sol";
import "../contracts/test/TestERC20.sol";
import "../contracts/test/WETH9.sol";
import "../contracts/interfaces/IUniswapV2Pair.sol";

contract DeployMyContract is Script {
    // WETH addresses for different networks
    address constant WETH_GOERLI = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
    address constant WETH_SEPOLIA = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
    address constant WETH_MUMBAI = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    address constant WETH_FUJI = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c;

    function getWethAddress() public view returns (address) {
        uint256 chainId = block.chainid;
        if (chainId == 5) return WETH_GOERLI;
        if (chainId == 11155111) return WETH_SEPOLIA;
        if (chainId == 80001) return WETH_MUMBAI;
        if (chainId == 43113) return WETH_FUJI;
        return address(0);
    }

    function createAndSetupTokens() internal returns (TestERC20[] memory) {
        TestERC20[] memory tokens = new TestERC20[](5);
        tokens[0] = new TestERC20("Token A", "TKNA", 18);
        tokens[1] = new TestERC20("Token B", "TKNB", 18);
        tokens[2] = new TestERC20("Token C", "TKNC", 18);
        tokens[3] = new TestERC20("Token D", "TKND", 18);
        tokens[4] = new TestERC20("Token E", "TKNE", 18);
        return tokens;
    }

    function createPairs(UniswapV2Factory factory, TestERC20[] memory tokens) internal returns (address[] memory) {
        address[] memory pairs = new address[](5);
        pairs[0] = factory.createPair(address(tokens[0]), address(tokens[1]));
        pairs[1] = factory.createPair(address(tokens[1]), address(tokens[2]));
        pairs[2] = factory.createPair(address(tokens[2]), address(tokens[3]));
        pairs[3] = factory.createPair(address(tokens[3]), address(tokens[4]));
        pairs[4] = factory.createPair(address(tokens[0]), address(tokens[4]));
        return pairs;
    }

    function setupInitialLiquidity(
        UniswapV2Router02 router,
        TestERC20[] memory tokens,
        address[] memory pairs,
        address deployer
    ) internal {
        uint amountDesired = 5000 * 10**18;
        for (uint i = 0; i < pairs.length; i++) {
            router.addLiquidity(
                address(tokens[i]),
                address(tokens[(i + 1) % tokens.length]),
                amountDesired,
                amountDesired,
                amountDesired * 95 / 100,
                amountDesired * 95 / 100,
                deployer,
                block.timestamp + 1800
            );
        }
    }

    function testSwap(
        UniswapV2Router02 router,
        TestERC20 token0,
        TestERC20 token1,
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
        TestERC20 token0,
        TestERC20 token1,
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
        if (wethAddress == address(0)) {
            WETH9 weth = new WETH9();
            wethAddress = address(weth);
        }

        // Deploy core contracts
        UniswapV2Factory factory = new UniswapV2Factory(deployer);
        UniswapV2Router02 router = new UniswapV2Router02(address(factory), wethAddress);

        // Create and setup tokens
        TestERC20[] memory tokens = createAndSetupTokens();
        for (uint i = 0; i < tokens.length; i++) {
            // tokens[i].mint(deployer, 10000 * 10**18);
            tokens[i].approve(address(router), type(uint256).max);
        }

        // Create pairs
        address[] memory pairs = createPairs(factory, tokens);

        // Log addresses
        console.log("\n=== Deployed Contract Addresses ===");
        console.log("WETH address:", wethAddress);
        console.log("Factory address:", address(factory));
        console.log("Router address:", address(router));

        console.log("\n=== Token Addresses ===");
        for (uint i = 0; i < tokens.length; i++) {
            console.log("%s (%s): %s", tokens[i].name(), tokens[i].symbol(), address(tokens[i]));
        }

        console.log("\n=== Trading Pairs ===");
        for (uint i = 0; i < pairs.length; i++) {
            console.log("Pair %d: %s - %s", i + 1, pairs[i], pairs[(i + 1) % pairs.length]);
        }

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

        // Test swap
        testSwap(router, tokens[0], tokens[1], deployer);

        // Test redeem
        testRedeem(router, tokens[0], tokens[1], pairs[0], deployer);

        vm.stopBroadcast();
    }
}