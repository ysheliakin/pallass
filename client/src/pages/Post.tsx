import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  // Add your styles here
`;

const PostContainer = styled.div`
  // Add your styles here
`;

const Title = styled.input`
  // Add your styles here
`;

const DescriptionTextarea = styled.textarea`
  // Add your styles here
`;

const Post: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Optionally fetch initial data or perform side effects here
  }, []);

  return (
    <Container>
      <PostContainer>
        <h2>
          <Title
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update title state on change
          />
        </h2>
        <p>
          <DescriptionTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update description state on change
          />
        </p>
      </PostContainer>
    </Container>
  );
};

export default Post;
