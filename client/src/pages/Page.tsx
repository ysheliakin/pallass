import React, { useState, useEffect } from 'react';

interface Post {
  postID: number;
  editID: number;
  userID: number;
  postType: number;
  postDate: string;
  title: string;
  description: string;
  comments: Comment[];
  rating: number;
}

interface Comment { 
  commentID: number;
  body: string; 
  editID: number;
  sourceID: number;
  postDate: string;	
}

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({ postId: '', content: '' });

  // Fetch posts from backend
  useEffect(() => {
    fetch('http://localhost:5000/posts') // TODO: UPDATE WITH THE BACKEND PORT  
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  // Handle adding a new post
  const handleAddPost = () => {
    fetch('http://localhost:5000/posts', { // TODO: UPDATE WITH THE BACKEND PORT 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => setPosts([...posts, data]));
  };

  // Handle adding a new comment
  const handleAddComment = (postID: number) => {
    fetch(`http://localhost:5000/posts/${postID}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment.content })
    })
      .then(response => response.json())
      .then(comment => {
        const updatedPosts = posts.map(post => {
          if (post.postID === postID) {
            post.comments.push(comment);
          }
          return post;
        });
        setPosts(updatedPosts);
      });
  };

  return (
    <div>
        Hello There
    </div>
  );
};

export default Page;
/*
<div>
      <h1>Posts</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>

      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <h3>Comments</h3>
          {post.comments.map(comment => (
            <p key={comment.id}>{comment.content}</p>
          ))}
          <input
            type="text"
            placeholder="Add comment"
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          />
          <button onClick={() => handleAddComment(post.id)}>Add Comment</button>
        </div>
      ))}
    </div>
*/