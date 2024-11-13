import { expect } from "chai";
import { ethers } from "ethers";

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
        const { contract, token } = await deploySablilerFixture();
        this.contract = contract;
        this.token = token;
        this.contractAddress = await this.contract.getAddress();
        this.tokenAddress = await this.token.getAddress();
        this.instances = await createInstances(this.signers);
    });

    it("should deploy Sablier contract and createPlan with durations", async function () {
      //mint
      const tx1 = await this.token.mint(100000);
      await tx1.wait();
        // Approval
        const inputAlice = this.instances.alice.createEncryptedInput(this.tokenAddress, this.signers.alice.address);
        inputAlice.add64(100000);
        const encryptedAllowanceAmount = inputAlice.encrypt();
        const tx = await this.token["approve(address,bytes32,bytes)"](
          this.contractAddress,
          encryptedAllowanceAmount.handles[0],
          encryptedAllowanceAmount.inputProof,
        );
        await tx.wait();
        console.log("Approval successful");

        const deposit = 1000; // Example deposit amount
        const input = this.instances.alice.createEncryptedInput(this.contractAddress, this.signers.alice.address);
        input.add64(deposit);
        const encryptedDeposit = input.encrypt();
        const createTrx= await this.contract["createWithDurationsIP(address,address,address,uint40,uint40,bytes32,bytes)"]
          ( this.signers.alice.address, this.signers.bob.address,this.tokenAddress, 100, 1000, encryptedDeposit.handles[0], encryptedDeposit.inputProof);  
        await createTrx.wait();
        const balanceHandleAlice = await this.token.balanceOf(this.signers.alice);
        const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
        const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.tokenAddress);
        const signatureAlice = await this.signers.alice.signTypedData(
          eip712.domain,
          { Reencrypt: eip712.types.Reencrypt },
          eip712.message,
        );
        const balanceAlice = await this.instances.alice.reencrypt(
          balanceHandleAlice,
          privateKeyAlice,
          publicKeyAlice,
          signatureAlice.replace("0x", ""),
          this.tokenAddress,
          this.signers.alice.address,
        );
    
        expect(balanceAlice).to.equal(100000 - 1000);
    });

    it("should create a plan and allow withdrawals", async function () {
            //mint
            const tx1 = await this.token.mint(100000);
            await tx1.wait();
              // Approval
              const inputAlice = this.instances.alice.createEncryptedInput(this.tokenAddress, this.signers.alice.address);
              inputAlice.add64(100000);
              const encryptedAllowanceAmount = inputAlice.encrypt();
              const tx = await this.token["approve(address,bytes32,bytes)"](
                this.contractAddress,
                encryptedAllowanceAmount.handles[0],
                encryptedAllowanceAmount.inputProof,
              );
              await tx.wait();
              console.log("Approval successful");
      
              const deposit = 1000; // Example deposit amount
              const input = this.instances.alice.createEncryptedInput(this.contractAddress, this.signers.alice.address);
              input.add64(deposit);
              const encryptedDeposit = input.encrypt();
              const createTrx= await this.contract["createWithDurationsIP(address,address,address,uint40,uint40,bytes32,bytes)"]
                ( this.signers.alice.address, this.signers.bob.address,this.tokenAddress, 0, 10, encryptedDeposit.handles[0], encryptedDeposit.inputProof);  
              await createTrx.wait();
              const balanceHandleAlice = await this.token.balanceOf(this.signers.alice);
              const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
              const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.tokenAddress);
              const signatureAlice = await this.signers.alice.signTypedData(
                eip712.domain,
                { Reencrypt: eip712.types.Reencrypt },
                eip712.message,
              );
              const balanceAlice = await this.instances.alice.reencrypt(
                balanceHandleAlice,
                privateKeyAlice,
                publicKeyAlice,
                signatureAlice.replace("0x", ""),
                this.tokenAddress,
                this.signers.alice.address,
              );
          
              expect(balanceAlice).to.equal(100000 - 1000);
              const planId = 1;
              const withdrawAmount = 1;
              const inputWithdraw = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
              inputWithdraw.add64(withdrawAmount);
              const encryptedWithdraw = inputWithdraw.encrypt();
              const withdrawTrx= await this.contract["withdraw(uint256,address,bytes32,bytes)"]
                (planId,this.signers.bob, encryptedWithdraw.handles[0], encryptedWithdraw.inputProof);
              await withdrawTrx.wait();

              const balanceHandleBob = await this.token.balanceOf(this.signers.bob.address);
              const { publicKey: publicKeyBob, privateKey: privateKeyBob } = this.instances.bob.generateKeypair();
              const eip712Bob = this.instances.bob.createEIP712(publicKeyBob, this.tokenAddress);
              const signatureBob = await this.signers.bob.signTypedData(
                eip712Bob.domain,
                { Reencrypt: eip712Bob.types.Reencrypt },
                eip712Bob.message,
              );
              const balanceBob = await this.instances.bob.reencrypt(
                balanceHandleBob,
                privateKeyBob,
                publicKeyBob,
                signatureBob.replace("0x", ""),
                this.tokenAddress,
                this.signers.bob.address,
              );
              expect(balanceBob).to.equal(1);
    
    });
    
    it("should not transfer assets until cliff period is over", async function () {
      const tx1 = await this.token.mint(100000);
      await tx1.wait();
        // Approval
        const inputAlice = this.instances.alice.createEncryptedInput(this.tokenAddress, this.signers.alice.address);
        inputAlice.add64(100000);
        const encryptedAllowanceAmount = inputAlice.encrypt();
        const tx = await this.token["approve(address,bytes32,bytes)"](
          this.contractAddress,
          encryptedAllowanceAmount.handles[0],
          encryptedAllowanceAmount.inputProof,
        );
        await tx.wait();
        console.log("Approval successful");

        const deposit = 1000; // Example deposit amount
        const input = this.instances.alice.createEncryptedInput(this.contractAddress, this.signers.alice.address);
        input.add64(deposit);
        const encryptedDeposit = input.encrypt();
        const createTrx= await this.contract["createWithDurationsIP(address,address,address,uint40,uint40,bytes32,bytes)"]
          ( this.signers.alice.address, this.signers.bob.address,this.tokenAddress, 100, 1000, encryptedDeposit.handles[0], encryptedDeposit.inputProof);  
        await createTrx.wait();
        const balanceHandleAlice = await this.token.balanceOf(this.signers.alice);
        const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
        const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.tokenAddress);
        const signatureAlice = await this.signers.alice.signTypedData(
          eip712.domain,
          { Reencrypt: eip712.types.Reencrypt },
          eip712.message,
        );
        const balanceAlice = await this.instances.alice.reencrypt(
          balanceHandleAlice,
          privateKeyAlice,
          publicKeyAlice,
          signatureAlice.replace("0x", ""),
          this.tokenAddress,
          this.signers.alice.address,
        );
    
        expect(balanceAlice).to.equal(100000 - 1000);
        const planId = 1;
        const withdrawAmount = 100;
        const inputWithdraw = this.instances.bob.createEncryptedInput(this.contractAddress, this.signers.bob.address);
        inputWithdraw.add64(withdrawAmount);
        const encryptedWithdraw = inputWithdraw.encrypt();
        const withdrawTrx= await this.contract["withdraw(uint256,address,bytes32,bytes)"]
          (planId,this.signers.bob, encryptedWithdraw.handles[0], encryptedWithdraw.inputProof);
        await withdrawTrx.wait();

        const balanceHandleBob = await this.token.balanceOf(this.signers.bob.address);
        const { publicKey: publicKeyBob, privateKey: privateKeyBob } = this.instances.bob.generateKeypair();
        const eip712Bob = this.instances.bob.createEIP712(publicKeyBob, this.tokenAddress);
        const signatureBob = await this.signers.bob.signTypedData(
          eip712Bob.domain,
          { Reencrypt: eip712Bob.types.Reencrypt },
          eip712Bob.message,
        );
        const balanceBob = await this.instances.bob.reencrypt(
          balanceHandleBob,
          privateKeyBob,
          publicKeyBob,
          signatureBob.replace("0x", ""),
          this.tokenAddress,
          this.signers.bob.address,
        );
        expect(balanceBob).to.equal(0);
    });

    it("should allow canceling a stream", async function () {
      const tx1 = await this.token.mint(100000);
      await tx1.wait();
        // Approval
        const inputAlice = this.instances.alice.createEncryptedInput(this.tokenAddress, this.signers.alice.address);
        inputAlice.add64(100000);
        const encryptedAllowanceAmount = inputAlice.encrypt();
        const tx = await this.token["approve(address,bytes32,bytes)"](
          this.contractAddress,
          encryptedAllowanceAmount.handles[0],
          encryptedAllowanceAmount.inputProof,
        );
        await tx.wait();
        console.log("Approval successful");

        const deposit = 1000; // Example deposit amount
        const input = this.instances.alice.createEncryptedInput(this.contractAddress, this.signers.alice.address);
        input.add64(deposit);
        const encryptedDeposit = input.encrypt();
        const createTrx= await this.contract["createWithDurationsIP(address,address,address,uint40,uint40,bytes32,bytes)"]
          ( this.signers.alice.address, this.signers.bob.address,this.tokenAddress, 100, 1000, encryptedDeposit.handles[0], encryptedDeposit.inputProof);  
        await createTrx.wait();
        const balanceHandleAlice = await this.token.balanceOf(this.signers.alice);
        const { publicKey: publicKeyAlice, privateKey: privateKeyAlice } = this.instances.alice.generateKeypair();
        const eip712 = this.instances.alice.createEIP712(publicKeyAlice, this.tokenAddress);
        const signatureAlice = await this.signers.alice.signTypedData(
          eip712.domain,
          { Reencrypt: eip712.types.Reencrypt },
          eip712.message,
        );
        const balanceAlice = await this.instances.alice.reencrypt(
          balanceHandleAlice,
          privateKeyAlice,
          publicKeyAlice,
          signatureAlice.replace("0x", ""),
          this.tokenAddress,
          this.signers.alice.address,
        );
    
        expect(balanceAlice).to.equal(100000 - 1000);
        const planId = 1;
        const cancelTrx= await this.contract.cancel(planId);
        await cancelTrx.wait();
        const balanceHandleNewAlice = await this.token.balanceOf(this.signers.alice.address);
        const newBalanceAlice = await this.instances.alice.reencrypt(
          balanceHandleNewAlice,
          privateKeyAlice,
          publicKeyAlice,
          signatureAlice.replace("0x", ""),
          this.tokenAddress,
          this.signers.alice.address,
        );
        expect(newBalanceAlice).to.equal(100000);
      });
});