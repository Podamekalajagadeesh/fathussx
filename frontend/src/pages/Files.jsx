import { useState, useEffect } from 'react';
import api from '../services/api';
import FileUploader from '../components/FileUploader';
import './Files.css';

const Files = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/api/files');
      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch files.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="files-container">
      <h1>Files</h1>
      <FileUploader onUploadSuccess={fetchFiles} />
      <div className="file-list">
        {files.map(file => (
          <div key={file.id} className="file-item">
            <a href={`/api/files/${file.id}`} download>{file.filename}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Files;