import { useState } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';

const ContentUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setStatus('Uploading file…');
      const res = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(res.data.filePath);
      setStatus('File uploaded successfully.');
    } catch (err) {
      console.error('Failed to upload file.', err);
      setStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>
      {status ? <p>{status}</p> : null}
    </div>
  );
};

ContentUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ContentUploader;