pragma solidity =0.8.28;
import {console} from "forge-std/console.sol";
import 'contracts/interfaces/IERC20.sol';

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library TransferHelper {
    function safeApprove(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        console.log("Approve success:", success);
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: APPROVE_FAILED');
    }

    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        console.log("Token address:", token);
        console.log("From address:", from);
        console.log("To address:", to);
        console.log("Value:", value);

        // 检查授权额度
        uint allowance = IERC20(token).allowance(from, msg.sender);
        console.log("Current allowance:", allowance);
        // 检查余额
        uint balance = IERC20(token).balanceOf(from);
        console.log("Current balance:", balance);
        // 检查地址是否为合约
        uint size;
        assembly {
            size := extcodesize(token)
        }
        console.log("Is contract:", size > 0);

        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FROM_FAILED');
    }

    function safeTransferETH(address to, uint value) internal {
        (bool success,) = to.call{value:value}(new bytes(0));
        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
    }
} 