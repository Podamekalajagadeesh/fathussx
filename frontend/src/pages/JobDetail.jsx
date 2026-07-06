import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError('Failed to fetch job details.');
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/jobs/${id}/apply`, { cover_letter: coverLetter });
      alert('Application submitted!');
    } catch (err) {
      setError('Failed to submit application.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!job) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="job-detail-container">
      <h1>{job.title}</h1>
      <h2>{job.company} - {job.location}</h2>
      <p>{job.description}</p>
      <h3>Requirements</h3>
      <p>{job.requirements}</p>

      <form onSubmit={handleApply}>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Cover Letter"
        ></textarea>
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default JobDetail;