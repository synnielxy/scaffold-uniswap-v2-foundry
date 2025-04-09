// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/UniswapV2Factory.sol";
import "../contracts/test/TestERC20.sol";
import "../contracts/UniswapV2Router02.sol";
import {console} from "forge-std/console.sol";

contract UniswapV2Liquidity is Test {

    UniswapV2Factory public factory;
    UniswapV2Router02 public router;
    TestERC20  public tokenA;
    TestERC20  public tokenB;
    address public pair;
    address public sender;

    function setUp() public {
        sender = address(0x1);

        // Deploy Factory
        factory = new UniswapV2Factory(msg.sender);
        
        // Deploy Router
        router = new UniswapV2Router02(address(factory), address(0));
        
        // Deploy test tokens
        tokenA = new TestERC20("Token A", "TKNA", 18);
        tokenB = new TestERC20("Token B", "TKNB", 18);

        tokenA.mint(sender, 10000);
        tokenB.mint(sender, 10000);
        
        // Create pair
        pair = factory.createPair(address(tokenA), address(tokenB));
        
        // Log addresses
        console.log("Factory deployed at:", address(factory));
        console.log("Router deployed at:", address(router));
        console.log("Token A deployed at:", address(tokenA));
        console.log("Token B deployed at:", address(tokenB));
        console.log("Pair address:", factory.getPair(address(tokenA), address(tokenB)));
        
    }

    function testAddLiquidity() public {

        uint256 amountA = 5000;
        uint256 amountB = 5000;
        address to = sender;

        vm.prank(sender);
        tokenA.approve(address(router), amountA);

        vm.prank(sender);
        tokenB.approve(address(router), amountB);

        vm.prank(sender);
        router.addLiquidity(address(tokenA), address(tokenB), amountA, amountB, 0, 0, to, block.timestamp);
    }
}
