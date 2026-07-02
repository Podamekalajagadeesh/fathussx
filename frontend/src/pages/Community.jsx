
import { Link } from 'react-router-dom';
import './Community.css';

const Community = () => {
  return (
    <div className="community-container">
      <h1>Community Hub</h1>
      <p>Connect, collaborate, and learn with other members of the ULE community.</p>
      
      <div className="community-sections">
        <div className="community-section card">
          <h2><Link to="/forum">Discussion Forum</Link></h2>
          <p>Ask questions, share knowledge, and engage in discussions on various topics.</p>
        </div>
        
        <div className="community-section card">
          <h2><Link to="/users">User Directory</Link></h2>
          <p>Find and connect with other users based on their skills and interests.</p>
        </div>
        
        <div className="community-section card">
          <h2><Link to="/projects">Collaborative Projects</Link></h2>
          <p>Discover and join projects that match your skills and passion.</p>
        </div>
      </div>
    </div>
  );
};

export default Community;