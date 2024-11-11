import { ethers } from "hardhat";

import type { SablierV2LockupLinear } from "../../types";
import { getSigners } from "../signers";

export async function deploySablilerFixture(): Promise<SablierV2LockupLinear> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("SablierV2LockupLinear");
  const contract = await contractFactory.connect(signers.alice).deploy(signers.alice.address, signers.bob.address);
  await contract.waitForDeployment();
  console.log("Sablier Contract Address is:", await contract.getAddress());

  return contract;
}