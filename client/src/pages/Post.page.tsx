import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Center, Paper, Title } from '@mantine/core';
import { getPost, Post } from '@/api/post';
import { Layout } from '@/components/layout';

export function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<Post | undefined | null>(undefined);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPost(Number(id));
      if (post?.ID) {
        setPost(post);
      } else {
        setPost(null);
      }
    };
    fetchPost();
  }, [id]);

  if (post === undefined) {
    return <h3>Loading...</h3>;
  }

  return (
    <Layout>
      <Button onClick={handleBackToDashboard} variant="light">
        Back to Your Dashboard
      </Button>
      <br />

      {post?.ID ? (
        <>
          <Center>
            <Title>{post?.Title}</Title>
          </Center>
          <Paper>
            <div style={{ margin: 'auto' }} dangerouslySetInnerHTML={{ __html: post?.Content }} />
          </Paper>
        </>
      ) : (
        <h3>Post not found :(</h3>
      )}
    </Layout>
  );
}
