import { ethers } from "hardhat";

import type { SablierV2LockupLinear, ConfidentialERC20 } from "../../types";
import { getSigners } from "../signers";

export async function deploySablilerFixture(): Promise<{ contract: SablierV2LockupLinear, token: ConfidentialERC20 }> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("SablierV2LockupLinear");
  const contract = await contractFactory.connect(signers.alice).deploy(signers.alice.address, signers.bob.address);
  await contract.waitForDeployment();
  console.log("Sablier Contract Address is:", await contract.getAddress());

  const tokenFactory = await ethers.getContractFactory("ConfidentialERC20");
  const token = await tokenFactory.connect(signers.alice).deploy();
  await token.waitForDeployment();
  console.log("Token Contract Address is:", await token.getAddress());

  return { contract, token };
} 
