import { useState } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';

const ContentUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // This is a placeholder for the actual upload endpoint
      // In a real application, this would upload to S3 or a similar service
      // and then you would create the content record with the URL
      const res = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(res.data.filePath);
    } catch (err) {
      console.error('Failed to upload file.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

ContentUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ContentUploader;