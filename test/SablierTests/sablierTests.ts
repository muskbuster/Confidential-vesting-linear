import { expect } from "chai";

import { awaitAllDecryptionResults } from "../asyncDecrypt";
import { createInstances } from "../instance";
import { getSigners, initSigners } from "../signers";
import { deploySablilerFixture } from "./sablier.fixture";
 
describe("Sablier tests", function () {
    before(async function () {
        await initSigners();
        this.signers = await getSigners();
      });

    beforeEach(async function () {
        const contract = await deploySablilerFixture();
        this.contractAddress = await contract.getAddress();
        this.sablier = contract;
        this.instances = await createInstances(this.signers);
        }
    );

    it ("should deploy Sablier contract", async function () {
        expect(this.contractAddress).to.not.be.undefined;
    }
    );
}
);