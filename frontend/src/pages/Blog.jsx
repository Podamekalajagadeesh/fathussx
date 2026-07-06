import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/api/blog/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch blog posts.');
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h2><Link to={`/blog/posts/${post.id}`}>{post.title}</Link></h2>
            <p>by {post.author_username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;