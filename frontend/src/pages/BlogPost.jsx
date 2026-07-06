import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/blog/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to fetch blog post.');
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog-post-container">
      <h1>{post.title}</h1>
      <p>by {post.author_username}</p>
      <div className="post-content">
        {post.content}
      </div>
    </div>
  );
};

export default BlogPost;