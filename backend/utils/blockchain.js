// This is a mock blockchain service for simulation purposes.
// In a real application, this would interact with a smart contract on a blockchain.

const mintNftCertificate = async (user, course) => {
  console.log(`Minting NFT for user ${user.id} for course ${course.id}`);

  // Simulate a delay for the minting process
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate a fake transaction hash and token ID
  const transactionHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const tokenId = Math.floor(Math.random() * 1000000).toString();

  console.log(`NFT minted with transaction hash: ${transactionHash}`);

  return { transactionHash, tokenId };
};

module.exports = { mintNftCertificate };