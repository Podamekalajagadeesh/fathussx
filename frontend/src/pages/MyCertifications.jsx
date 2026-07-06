import SubNav from '../components/SubNav';
import { useState, useEffect } from 'react';
import api from '../services/api';


const CertNav = [
  { to: '/certifications', label: 'All Certifications' },
  { to: '/my-certifications', label: 'My Certifications', end: true },
];

const MyCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCertifications = async () => {
      try {
        const res = await api.get('/api/certifications/my-certifications');
        setCertifications(res.data);
      } catch (err) {
        setError('Failed to fetch your certifications.');
      }
    };
    fetchMyCertifications();
  }, []);

  return (
    <div className="my-certifications-container">
      <SubNav links={CertNav} />
      <h1>My Certifications</h1>
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

export default MyCertifications;