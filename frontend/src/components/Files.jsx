
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Files.css';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('/api/files', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setFiles(res.data);
      } catch (err) {
        setError('Failed to fetch files');
      }
    };
    fetchFiles();
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('/api/files/upload', formData, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        });
        setFiles([...files, res.data]);
        setSuccess('File uploaded successfully');
        setError('');
      } catch (err) {
        setError('Failed to upload file');
        setSuccess('');
      }
    }
  };

  const onDownload = async (fileId, filename) => {
    try {
      const res = await axios.get(`/api/files/${fileId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Failed to download file');
    }
  };

  return (
    <div className="files-container">
      <h2>File Management</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="upload-section">
        <h3>Upload a New File</h3>
        <input type="file" onChange={onFileChange} />
      </div>
      <div className="files-list-section">
        <h3>Your Files</h3>
        {files.length > 0 ? (
          <ul className="files-list">
            {files.map((file) => (
              <li key={file.id} className="file-item">
                <span>{file.filename}</span>
                <button onClick={() => onDownload(file.id, file.filename)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files found.</p>
        )}
      </div>
    </div>
  );
};

export default Files;