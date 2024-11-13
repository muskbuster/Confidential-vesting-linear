import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy ConfidentialERC20
  const confidentialERC20 = await deploy("ConfidentialERC20", {
    from: deployer,
    log: true,
  });

  console.log(`ConfidentialToken contract deployed at: ${confidentialERC20.address}`);

  // Deploy SablierV2LockupLinear
  const sablierV2LockupLinear = await deploy("SablierV2LockupLinear", {
    from: deployer,
    log: true,
    args: [deployer,deployer], // Pass any constructor arguments here
  });

  console.log(`SablierV2LockupLinear contract deployed at: ${sablierV2LockupLinear.address}`);
};

export default func;
func.id = "deploy_confidentialERC20_and_lockuplinear";
func.tags = ["ConfidentialToken", "LockupLinear"];