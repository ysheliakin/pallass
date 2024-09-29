import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRegComment, FaShare } from 'react-icons/fa'; // Importing comment and share icons

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

const Title = styled.div`
  // Add your styles here
`;

const TitleUnderline = styled.div`
  height: 2px;
  background: #000000; /* Color of the line */
  margin-bottom: 15px; /* Space between the line and description */
`;


const DescriptionTextarea = styled.div`
  // Add your styles here
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 15px;  /* Increased padding for a rounder look */
  border: 1px solid #ccc;
  border-radius: 25px;  /* Increased border-radius for a circular shape */
  background-color: #fff;
  margin-top: 10px;
  resize: vertical;
  font-size: 14px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #0079d3;  /* Reddit's blue color */
    box-shadow: 0 0 5px rgba(0, 121, 211, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Space between buttons */
  margin-top: 15px; /* Space above the button row */
`;

const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const ShareContainer = styled.div`
  display: flex;
  align-items: center;
`;

const OvalButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 30px; /* Make it oval */
  width: 120px; /* Adjust width for oval shape */
  height: 40px; /* Adjust height for oval shape */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const VoteButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${(props) => (props.active ? (props.children === '▲' ? 'green' : 'red') : '#000')};
  margin: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #0079d3; /* Edit button color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px; /* Space between title and button */

  &:hover {
    background-color: #005f8d; /* Darker shade on hover */
  }
`;

const VoteCount = styled.div`
  margin-left: 10px;
  font-size: 18px;
`;

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CommentCount = styled.div`
  font-size: 18px;
  margin-left: 10px; /* Space between icon and count */
`;

const Share = styled.div`
  font-size: 18px;
  margin-left: 10px; /* Space between icon and count */
`;




const Post: React.FC = () => {
  const [title, setTitle] = useState('Columbus Crew get White House reception for MLS Cup 2023 win');
  const [description, setDescription] = useState("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum'' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.");
  const [comment, setComment] = useState('');
  const [votes, setVotes] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0); // State for comment count
  const [newComment, setNewComment] = useState({ postId: '', content: '' });
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    // Optionally fetch initial data or perform side effects here
  }, []);

  const handleUpvote = () => {
    setVotes((prev) => (upvoted ? prev - 1 : prev + 1));
    setUpvoted(!upvoted);
    if (downvoted) {
      setVotes((prev) => prev + 1); // Reset downvote if upvoted
      setDownvoted(false);
    }
  };

  const handleDownvote = () => {
    setVotes((prev) => (downvoted ? prev + 1 : prev - 1));
    setDownvoted(!downvoted);
    if (upvoted) {
      setVotes((prev) => prev - 1); // Reset upvote if downvoted
      setUpvoted(false);
    }
  };

  const handleShare = () => {

  };

  // Handle editing a post
  const handleAddPost = () => { // TODO: Change this code! 
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

const handleEdit = () => {
  // Implement edit functionality here
  alert('Edit button clicked!'); // Placeholder action
};

  return (
    <Container>
      <PostContainer>
      <EditButton onClick={handleEdit}>Edit</EditButton>
        <h2>
          <Title> {title} </Title>
        </h2>
        <TitleUnderline /> {/* Line under the title */}
        <p>
          <DescriptionTextarea>
            {description}
          </DescriptionTextarea>
        </p>
         <ButtonContainer>
          <OvalButtonContainer>
            <VoteButton onClick={handleUpvote} active={upvoted}>
              ▲
            </VoteButton>
            <VoteCount>{votes}</VoteCount>
            <VoteButton onClick={handleDownvote} active={downvoted}>
              ▼
            </VoteButton>
          </OvalButtonContainer>

          <OvalButtonContainer>
            <FaRegComment size={24} />
            <CommentCount>{commentsCount}</CommentCount>
          </OvalButtonContainer>

          <OvalButtonContainer>
            <FaShare size={24} onClick={handleShare} />
            <Share>Share</Share>
          </OvalButtonContainer>
        </ButtonContainer>
        <CommentTextarea
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Update comment state on change
          placeholder="Add your comment here..."
        />
        </PostContainer>
    </Container>
  );
};

export default Post;
