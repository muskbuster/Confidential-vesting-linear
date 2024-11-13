import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

import type { SablierV2LockupLinear, ConfidentialERC20 } from "../../types";
import { getSigners } from "../signers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get signers
  const signers = await getSigners();

  // Deploy ConfidentialERC20
  const confidentialToken = await deploy("ConfidentialERC20", {
    from: deployer,
    log: true,
  });
  console.log(`ConfidentialERC20 contract deployed at: ${confidentialToken.address}`);

  // Deploy SablierV2LockupLinear
  const sablierFactory = await ethers.getContractFactory("SablierV2LockupLinear");
  const sablierContract = await sablierFactory.connect(signers.alice).deploy(signers.alice.address, signers.bob.address);
  await sablierContract.waitForDeployment();
  console.log("SablierV2LockupLinear contract deployed at:", await sablierContract.getAddress());

  return { confidentialToken, sablierContract };
};

export default func;
func.id = "deploy_confidentialERC20_and_sablier";
func.tags = ["ConfidentialToken", "Sablier"];
