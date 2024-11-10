// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.22;

import { UD60x18, ud } from "@prb/math/src/UD60x18.sol";
import  "fhevm/lib/TFHE.sol";
import { Lockup, LockupLinear } from "../types/DataTypes.sol";
import { Errors } from "./Errors.sol";

/// @title Helpers
/// @notice Library with helper functions needed across the Sablier V2 contracts.
library Helpers {
    /*//////////////////////////////////////////////////////////////////////////
                             INTERNAL CONSTANT FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Calculate the timestamps and return the segments.


    /// @dev Calculate the timestamps and return the tranches.

    /// @dev Checks the parameters of the {SablierV2LockupLinear-_create} function.
    function checkCreateLockupLinear(euint64 depositAmount, LockupLinear.Timestamps memory timestamps) internal view  {
        // Check: the deposit amount is not zero.

        // Check: the start time is not zero.
        if (timestamps.start == 0) {
            revert Errors.SablierV2Lockup_StartTimeZero();
        }

        // Since a cliff time of zero means there is no cliff, the following checks are performed only if it's not zero.
        if (timestamps.cliff > 0) {
            // Check: the start time is strictly less than the cliff time.
            if (timestamps.start >= timestamps.cliff) {
                revert Errors.SablierV2LockupLinear_StartTimeNotLessThanCliffTime(timestamps.start, timestamps.cliff);
            }

            // Check: the cliff time is strictly less than the end time.
            if (timestamps.cliff >= timestamps.end) {
                revert Errors.SablierV2LockupLinear_CliffTimeNotLessThanEndTime(timestamps.cliff, timestamps.end);
            }
        }

        // Check: the start time is strictly less than the end time.
        if (timestamps.start >= timestamps.end) {
            revert Errors.SablierV2LockupLinear_StartTimeNotLessThanEndTime(timestamps.start, timestamps.end);
        }

        // Check: the end time is in the future.
        uint40 blockTimestamp = uint40(block.timestamp);
        if (blockTimestamp >= timestamps.end) {
            revert Errors.SablierV2Lockup_EndTimeNotInTheFuture(blockTimestamp, timestamps.end);
        }
    }

    /// @dev Checks the parameters of the {SablierV2LockupTranched-_create} function.
    /*//////////////////////////////////////////////////////////////////////////
                             PRIVATE CONSTANT FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Checks that:
    ///
    /// 1. The first timestamp is strictly greater than the start time.
    /// 2. The timestamps are ordered chronologically.
    /// 3. There are no duplicate timestamps.
    /// 4. The deposit amount is equal to the sum of all segment amounts.

}
