import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/jobs');
        setJobs(res.data);
      } catch (err) {
        setError('Failed to fetch jobs.');
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="jobs-container">
      <h1>Job Board</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="job-list">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <h2><Link to={`/jobs/${job.id}`}>{job.title}</Link></h2>
            <p>{job.company} - {job.location}</p>
            <p>{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;