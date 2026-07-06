import { useState, useEffect } from 'react';
import api from '../services/api';
import SubNav from '../components/SubNav';

const CertNav = [
  { to: '/certifications', label: 'All Certifications', end: true },
  { to: '/my-certifications', label: 'My Certifications' },
];

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await api.get('/api/certifications');
        setCertifications(res.data);
      } catch (err) {
        setError('Failed to fetch certifications.');
      }
    };
    fetchCertifications();
  }, []);

  return (
    <div className="certifications-container">
      <SubNav links={CertNav} />
      <h1>Certifications</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="certification-list">
        {certifications.map(cert => (
          <div key={cert.id} className="certification-card">
            <h2>{cert.name}</h2>
            <p>{cert.description}</p>
            <p><strong>Issued by:</strong> {cert.issuing_body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
