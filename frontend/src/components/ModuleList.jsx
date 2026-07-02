import { useState, useEffect } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';

const ContentUploader = ({ moduleId, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('content', file);
    try {
      const res = await api.post(`/api/modules/${moduleId}/content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(res.data.filePath);
    } catch (err) {
      console.error('Failed to upload content.');
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
  moduleId: PropTypes.number.isRequired,
  onUpload: PropTypes.func.isRequired,
};

const ModuleList = ({ courseId }) => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get(`/api/courses/${courseId}/modules`);
        setModules(res.data);
      } catch (err) {
        console.error('Failed to fetch modules.');
      }
    };
    fetchModules();
  }, [courseId]);

  return (
    <div>
      <h3>Modules</h3>
      {modules.map((module) => (
        <div key={module.id}>
          <h4>{module.title}</h4>
          {/* Content for each module will go here */}
          <ContentUploader moduleId={module.id} onUpload={(filePath) => console.log(filePath)} />
        </div>
      ))}
    </div>
  );
};

ModuleList.propTypes = {
  courseId: PropTypes.number.isRequired,
};

export default ModuleList;