import {expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import ContractAbi from '../build/ERC1155Certificate.json';

use(solidity);

describe('ERC1155Certificate', () => {
  const [deployer, issuer1, issuer2, receiver1, receiver2, receiver3, receiver4] = new MockProvider().getWallets();
  let contractInstance: Contract;
  let contractInstanceIssuer1: Contract;
  let contractInstanceIssuer2: Contract;

  beforeEach(async () => {
    contractInstance = await deployContract(deployer, ContractAbi);
    // issueCertificateの実行
    contractInstanceIssuer1 = await contractInstance.connect(issuer1)
    await contractInstanceIssuer1.issueCertificate("Certificate No.1", 2, [receiver1.address, receiver2.address], 0x101, {from: issuer1.address});
    contractInstanceIssuer2 = await contractInstance.connect(issuer2)
    await contractInstanceIssuer2.issueCertificate("Certificate No.2", 3, [receiver1.address, receiver2.address, receiver3.address], 0x101, {from: issuer2.address});
  });

  it('check issued Certificate', async () => {
    // let result = await contractInstance.certificates(1);
    // console.log(result)
  });

  it('Issue certificates to receiver', async () => {
    console.log("issuer1", issuer1.address);
    console.log("receiver1", receiver1.address);

    // 「TransferSingle」イベントの取得
    // const filter = contractInstance.filters.TransferSingle()
    // const events = await contractInstance.queryFilter(filter)
    // console.log(events)

    expect(await contractInstance.balanceOf(issuer1.address, 1)).to.equal(0);
    expect(await contractInstance.balanceOf(receiver1.address, 1)).to.equal(1);
    expect(await contractInstance.balanceOf(receiver2.address, 1)).to.equal(1);
  });

  it('Check certificate of hold', async () => {
    let result = await contractInstance.getMyCertificateId(receiver1.address)
    expect(result[0]).to.equal(1);
    // expect(result[1]).to.equal(2);
  })


  // it('Assigns initial balance', async () => {
  //   expect(await token.balanceOf(wallet.address)).to.equal(1000);
  // });

  // it('Transfer adds amount to destination account', async () => {
  //   await token.transfer(walletTo.address, 7);
  //   expect(await token.balanceOf(walletTo.address)).to.equal(7);
  // });

  // it('Transfer emits event', async () => {
  //   await expect(token.transfer(walletTo.address, 7))
  //     .to.emit(token, 'Transfer')
  //     .withArgs(wallet.address, walletTo.address, 7);
  // });

  // it('Can not transfer above the amount', async () => {
  //   await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  // });

  // it('Can not transfer from empty account', async () => {
  //   const tokenFromOtherWallet = token.connect(walletTo);
  //   await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
  //     .to.be.reverted;
  // });

  // it('Calls totalSupply on BasicToken contract', async () => {
  //   await token.totalSupply();
  //   expect('totalSupply').to.be.calledOnContract(token);
  // });

  // it('Calls balanceOf with sender address on BasicToken contract', async () => {
  //   await token.balanceOf(wallet.address);
  //   expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);
  // });
});
