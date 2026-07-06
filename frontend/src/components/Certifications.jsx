import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuing_organization: '',
    date_earned: '',
    credential_id: '',
    credential_url: '',
  });
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCertifications = async () => {
      if (token) {
        try {
          const res = await api.get('/api/certifications');
          setCertifications(res.data);
        } catch (err) {
          console.error('Failed to fetch certifications:', err);
        }
      }
    };

    fetchCertifications();
  }, [token]);

  const handleInputChange = (e) => {
    setNewCertification({ ...newCertification, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/certifications', newCertification);
      setCertifications([...certifications, res.data]);
      setNewCertification({
        name: '',
        issuing_organization: '',
        date_earned: '',
        credential_id: '',
        credential_url: '',
      });
    } catch (err) {
      console.error('Failed to add certification:', err);
    }
  };

  return (
    <div className="card">
      <h3>My Certifications</h3>
      <div className="certifications-list">
        {certifications.map(cert => (
          <div key={cert.id} className="certification-item">
            <strong>{cert.name}</strong> - {cert.issuing_organization}
            <p>Earned on: {new Date(cert.date_earned).toLocaleDateString()}</p>
            {cert.credential_url && <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">View Credential</a>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="add-certification-form">
        <h4>Add New Certification</h4>
        <input type="text" name="name" value={newCertification.name} onChange={handleInputChange} placeholder="Certification Name" required />
        <input type="text" name="issuing_organization" value={newCertification.issuing_organization} onChange={handleInputChange} placeholder="Issuing Organization" required />
        <input type="date" name="date_earned" value={newCertification.date_earned} onChange={handleInputChange} />
        <input type="text" name="credential_id" value={newCertification.credential_id} onChange={handleInputChange} placeholder="Credential ID" />
        <input type="text" name="credential_url" value={newCertification.credential_url} onChange={handleInputChange} placeholder="Credential URL" />
        <button type="submit">Add Certification</button>
      </form>
    </div>
  );
};

export default Certifications;