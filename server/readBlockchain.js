const { ethers } = require("ethers");
require("dotenv").config();
const contractJSON = require('./contracts/testEther.json')
// console.log(contractJSON.networks[80001].address)

/* https://docs.ethers.org/v6/getting-started/ */

/*
  Provider
    - A Provider is a read-only connection to the blockchain, which allows querying the blockchain state, 
        such as account, block or transaction details, querying event logs or evaluating read-only code 
        using call.
    - Provider offering both read and write access.
    - In Ethers, all write operations are further abstracted into another Object, the Signer.
*/

console.log("Provider");

const broadcastTransaction = async () => {
  console.log("provider.broadcastTransaction(signedTx: string)") //tx.hash = 0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const transaction = {
    to: process.env.Recipient_Address, // Replace with the recipient's address
    value: ethers.parseEther('1.0'), // Sending 1 Matic
    gasLimit: 300000,
    chainId: 80001,
    gasPrice: ethers.parseUnits('100', 'gwei'),
    nonce: await provider.getTransactionCount(wallet.getAddress())
  };
  // console.log(transaction)

  // Sign the transaction
  const signedTransaction = await wallet.signTransaction(transaction);
  // console.log(signedTransaction)

  // Broadcast the signed transaction 
  const transactionResponse = await provider.broadcastTransaction(signedTransaction);
  console.log('Transaction hash:', transactionResponse.hash);
}

// broadcastTransaction()

//================================================================================================================================================//

const call = async () => {
  console.log("provider.call(tx: TransactionRequest)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Contract address and ABI
  const contractAddress = contractJSON.networks[80001].address; // Replace with the contract's address
  const contractABI = [
    "function myUint() view returns (uint256)",
    "function myAddress() view returns (address)"
  ]; // Replace with the contract's ABI

  // Create a contract instance
  const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

  // Function name and parameters
  let functionName = 'myUint';
  // let functionParams = [param1, param2]; // Replace with the actual function parameters if any

  // Call the function using provider.call
  const myUint = await provider.call({
    to: contractInstance.target,
    data: contractInstance.interface.encodeFunctionData(functionName)
    // data: contractInstance.interface.encodeFunctionData(functionName, functionParams)
  });
  console.log("myUint: ", myUint)

  // Decode the myUint
  const uintDecodedResult = contractInstance.interface.decodeFunctionResult(functionName, myUint);

  console.log("uintDecodedResult: ", uintDecodedResult);

  // Function name and parameters
  functionName = 'myAddress';
  // functionParams = [param1, param2]; // Replace with the actual function parameters if any


  const myAddress = await provider.call({
    to: contractInstance.target,
    data: contractInstance.interface.encodeFunctionData(functionName)
    // data: contractInstance.interface.encodeFunctionData(functionName, functionParams)
  });
  console.log("myAddress: ", myAddress)

  // Decode the myAddress
  const addressDecodedResult = contractInstance.interface.decodeFunctionResult(functionName, myAddress);

  console.log("addressDecodedResult: ", addressDecodedResult);
}

// call();

//================================================================================================================================================//

const destroy = async () => {
  console.log("provider.destroy")

  let provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
  console.log(await provider.getBlockNumber());

  //the provider object will be automatically garbage collected by JavaScript when it's no longer referenced, 
  //  which effectively disconnects and cleans up the resources associated with it.
}
// destroy();

//================================================================================================================================================//


const estimateGas = async () => {
  console.log("provider.estimateGas(tx: TransactionRequest)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const transaction = {
    from: wallet.address,
    to: process.env.Recipient_Address,
    value: ethers.parseEther("1.0"),
  };
  console.log(transaction)

  try {
    const gasEstimate = await provider.estimateGas(transaction);
    console.log(`Estimated gas: ${gasEstimate.toString()}`);
  } catch (error) {
    console.error('Error estimating gas:', error);
  }
}
// estimateGas();

//================================================================================================================================================//


const getBalance = async () => {
  console.log("provider.getBalance(address: AddressLike, blockTag?: BlockTag)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  await provider.getBalance(wallet.address)
    .then(e => { console.log(ethers.formatEther(e)) })
    .catch(err => { console.log(err) });
}
// getBalance();

//================================================================================================================================================//

const getBlock = async () => {
  console.log("provider.getBlock(blockHashOrBlockTag: BlockTag | string, prefetchTxs?: boolean)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  let blockNumber;

  await provider.getBlockNumber()
    .then(e => { blockNumber = e })
    .catch(err => { console.log("err: ", err) });

  await provider.getBlock(blockNumber)
    .then(e => { console.log("Block Details: ", e) })
    .catch(err => { console.log("err: ", err) });
}
// getBlock();

//================================================================================================================================================//

const getCode = async () => {
  console.log("provider.getCode(address: AddressLike, blockTag?: BlockTag)")

  //The getCode method in Ether.js is used to retrieve the bytecode of a contract deployed on 
  //  the Ethereum blockchain.

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  await provider.getCode(contractJSON.networks[80001].address)
    .then(e => { console.log("ByteCode: ", e) })
    .catch(err => { console.log("err: ", err) });
}
// getCode();

//================================================================================================================================================//

const getFeeData = async () => {
  console.log("provider.getFeeData()")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  await provider.getFeeData()
    .then(e => { console.log("FeeData: ", e) })
    .catch(err => { console.log("err: ", err) });
}
// getFeeData();

//================================================================================================================================================//

const getLogs = async () => {
  console.log("provider.getLogs(filter: Filter | FilterByBlockHash)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
  // console.log(await provider.getBlockNumber())

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(wallet)
  // Define the filter criteria
  const filter = {
    address: '0x82FC83107C9A87CAC8De60D8528A7c973942620b', // The address of the smart contract
    // topics: ['0xabcdef123...'], // An array of event topics to filter by (optional)
    fromBlock: 0, // The block number to start searching from (optional)
    toBlock: 'latest' // The block number to end searching (optional)
  }

  // Get the logs based on the filter
  const logs = await provider.getLogs(filter);

  // Process the logs
  logs.forEach((log) => {
    console.log('Log:', log);
    console.log('Block Number:', log.blockNumber);
    console.log('Transaction Hash:', log.transactionHash);
    console.log('Event:', log.topics[0]);
    console.log('Data:', log.data);
  });
}
// getLogs();

//================================================================================================================================================//

const getNetwork = async () => {
  console.log("provider.getNetwork()")

  // const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/003dc138d48f46d2b74c5df28b3cc123');
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  await provider.getNetwork()
    .then(e => {
      console.log('Network:', e.name);
      console.log('Chain ID:', e.chainId);
    })
    .catch(error => {
      console.error('Error retrieving network information:', error);
    })
}
// getNetwork();

//================================================================================================================================================//

const getStorage = async () => {
  console.log("provider.getStorage(address: AddressLike, position: BigNumberish, blockTag?: BlockTag)")

  // const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/003dc138d48f46d2b74c5df28b3cc123');
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the contract address
  const contractAddress = '0xabcdef123...'; // Replace with the contract's address

  // Specify the storage slot to retrieve
  const storageSlot = '0x0'; // Replace with the desired storage slot

  // Call the getStorage method
  try {
    const storageValue = await provider.getStorageAt(contractAddress, storageSlot);
    console.log(`Value at storage slot ${storageSlot}: ${storageValue}`);
  } catch (error) {
    console.error('Error retrieving contract storage:', error);
  }
}
// getStorage();

//================================================================================================================================================//

const getTransaction = async () => {
  console.log("provider.getTransaction(hash: string)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the transactionHash
  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a';

  provider.getTransaction(transactionHash)
    .then(transaction => {
      console.log('Transaction Details:');
      console.log('---------------------');
      console.log('Hash:', transaction.hash);
      console.log('Block Number:', transaction.blockNumber);
      console.log('From:', transaction.from);
      console.log('To:', transaction.to);
      console.log('Value:', ethers.formatEther(transaction.value));
      console.log('Gas Price:', ethers.formatUnits(transaction.gasPrice, 'gwei'));
      console.log('Gas Limit:', transaction.gasLimit);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
// getTransaction();

//================================================================================================================================================//

const getTransactionCount = async () => {
  console.log("provider.getTransactionCount(address: AddressLike, blockTag?: BlockTag)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the address
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  try {
    const transactionCount = await provider.getTransactionCount(wallet.address);
    console.log(`Transaction Count: ${transactionCount}`);
  } catch (error) {
    console.error('Error fetching transaction count:', error);
  }
}
// getTransactionCount();

//================================================================================================================================================//

const getTransactionReceipt = async () => {
  console.log("provider.getTransactionReceipt(hash: string)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the transactionHash
  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a';


  provider.getTransactionReceipt(transactionHash)
    .then((receipt) => {
      // Handle the receipt object
      console.log(receipt);
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
}
// getTransactionReceipt();

//================================================================================================================================================//

const getTransactionResult = async () => {
  console.log("provider.getTransactionResult(hash: string)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  // Specify the transactionHash
  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a';

  // Call the getTransactionReceipt method
  provider.getTransactionReceipt(transactionHash)
    .then((receipt) => {
      // Handle the receipt data
      console.log(receipt);
      console.log(`Transaction status: ${receipt.status}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`Block number: ${receipt.blockNumber}`);
      console.log(`Logs: ${receipt.logs}`);
    })
    .catch((error) => {
      console.error(error);
    });
}
// getTransactionResult();

//================================================================================================================================================//

const lookupAddress = async () => {
  console.log("provider.lookupAddress(address: string)")

  const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/003dc138d48f46d2b74c5df28b3cc123');

  // Specify the address
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  try {
    const name = await provider.lookupAddress(wallet.address);
    console.log(`ENS name for address ${wallet.address}: ${name}`);
  } catch (error) {
    console.error('Error retrieving ENS name:', error);
  }
}
// lookupAddress();

//================================================================================================================================================//

const resolveName = async () => {
  console.log("provider.resolveName(ensName: string)")

  const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/003dc138d48f46d2b74c5df28b3cc123');

  // Specify the ENS name
  const ensName = 'vitalik.eth';

  try {
    const address = await provider.resolveName(ensName);
    console.log(`The address of ${ensName} is ${address}`);
  } catch (error) {
    console.log(`Failed to resolve ENS name ${ensName}: ${error.message}`);
  }
}
// resolveName();

//================================================================================================================================================//

const waitForBlock = async () => {
  console.log("Not Working")
  console.log("provider.waitForBlock(blockTag?: BlockTag)")

  // const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/003dc138d48f46d2b74c5df28b3cc123');
  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  try {
    // Wait for the latest block
    const latestBlockNumber = await provider.getBlockNumber();
    console.log('Latest Block Number:', latestBlockNumber);

    const specificBlockNumber = 123456; // Replace with the desired block number

    // Wait for a specific block
    const block = await provider.waitForBlock(specificBlockNumber);
    console.log('Block:', block);

    // Wait for the earliest block
    const earliestBlock = await provider.waitForBlock('earliest');
    console.log('Earliest Block:', earliestBlock);

    // Wait for a pending block
    const pendingBlock = await provider.waitForBlock('pending');
    console.log('Pending Block:', pendingBlock);
  }
  catch (err) {
    console.log("err: ", err);
  }
}
// waitForBlock();

//================================================================================================================================================//

const waitForTransaction = async () => {
  console.log("provider.waitForTransaction(hash: string, confirms?: number, timeout?: number)")

  const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

  const transactionHash = '0xb1054e76606822f4ecb65348f78307b3df61f9cccebab239dc358e3568e04c4a'; // Replace with the transaction hash you want to wait for

  try {
    const transactionReceipt = await provider.waitForTransaction(transactionHash);
    console.log('Transaction confirmed!');
    console.log('Block number:', transactionReceipt.blockNumber);
    console.log('Gas used:', transactionReceipt.gasUsed.toString());
  } catch (error) {
    console.log('Transaction failed or not confirmed within the timeout.');
    console.error(error);
  }
}
// waitForTransaction();

//================================================================================================================================================//
//================================================================================================================================================//