const crypto = require('crypto');

const mintNftCertificate = async (user, course) => {
  console.log(`Issuing certificate for user ${user.id} for course ${course.id}`);

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const seed = `${user.id}:${course.id}:${Date.now()}`;
  const transactionHash = crypto.createHash('sha256').update(seed).digest('hex');
  const certificateId = `CERT-${course.id.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  return {
    status: 'issued',
    transactionHash,
    certificateId,
    issuedAt: new Date().toISOString(),
  };
};

module.exports = { mintNftCertificate };