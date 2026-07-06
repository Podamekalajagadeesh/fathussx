import { useState, useEffect } from 'react';
import api from '../services/api';

const MyNftCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/api/web3/my-certificates');
        setCertificates(res.data);
      } catch (err) {
        setError('Failed to fetch your NFT certificates.');
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="my-nft-certificates-container">
      <h1>My NFT Certificates</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="certificate-list">
        {certificates.length > 0 ? (
          certificates.map((cert, index) => (
            <div key={index} className="certificate-card">
              <h2>{cert.course_name}</h2>
              <p><strong>Transaction Hash:</strong> {cert.transaction_hash}</p>
              <p><strong>Token ID:</strong> {cert.token_id}</p>
              <p><strong>Minted on:</strong> {new Date(cert.minted_at).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>You have not earned any NFT certificates yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyNftCertificates;