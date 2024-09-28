import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const Container = styled.div`
  background-color: #f0f0f0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostContainer = styled.div`
  background-color: #ffffff;
  border: 2px solid #ccc; /* Gray border */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center children horizontally */
`;

const TitleInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 24px;
  font-weight: bold;
  width: 100%;
`;

const DescriptionTextarea = styled.textarea`
  width: 100%; /* Make it take full width */
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  resize: none; /* Disable resizing */
  margin-top: 10px; /* Add some space above */
`;

const CreateButton = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: center; /* Center button if using flexbox */

  &:hover {
    background-color: #0056b3;
  }
`;

const CircleButton = styled.button<{ isClicked: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Make it circular */
  background-color: ${({ isClicked }) => (isClicked ? 'green' : 'red')};
  color: white;
  border: 3px solid #ddd;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px; /* Space between button and text */

  &:hover {
    opacity: 0.8; /* Slightly reduce opacity on hover */
  }
`;

const ApprovalMessageContainer = styled.div`
  display: flex;
  align-items: center; /* Center items vertically */
  margin-top: 20px; /* Space above the message */
`;

const ApprovalMessage = styled.span`
  font-size: 16px; /* Font size for the message */
`;

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({ postId: '', content: '' });
  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState('Description');
  const [isButtonClicked, setIsButtonClicked] = useState(false);

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

  // Handle the circle button click
  const handleApprovalClick = () => {
    setIsButtonClicked(!isButtonClicked); // Toggle button state
  };

  return (
    <div>
    <h1>
          Create a post
      </h1>
    <Container>

      <PostContainer>
        <h2>
        <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </h2>
        <p>
          <DescriptionTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
        </p>
        <ApprovalMessageContainer>
          <CircleButton onClick={handleApprovalClick} isClicked={isButtonClicked}>
            
          </CircleButton>
          <ApprovalMessage>A moderator must approve a post before it is posted.</ApprovalMessage>
        </ApprovalMessageContainer>
        <CreateButton onClick={handleAddPost}>Create Post</CreateButton>
  
      </PostContainer>
    </Container>
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