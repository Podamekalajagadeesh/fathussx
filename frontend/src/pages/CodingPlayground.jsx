import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodingPlayground = () => {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/execute', { code, language });
      if (res.data.stdout) {
        setOutput(res.data.stdout);
      } else if (res.data.stderr) {
        setOutput(res.data.stderr);
      } else {
        setOutput('Execution finished with no output.');
      }
    } catch (error) {
      setOutput('Error executing code');
    }
    setLoading(false);
  };

  return (
    <div className="playground-container">
      <h1>Interactive Coding Playground</h1>
      <div className="playground-controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={handleRun} disabled={loading}>
          {loading ? 'Running...' : 'Run'}
        </button>
      </div>
      <Editor
        height="60vh"
        language={language}
        value={code}
        onChange={(newValue) => setCode(newValue)}
        theme="vs-dark"
      />
      <div className="playground-output">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodingPlayground;