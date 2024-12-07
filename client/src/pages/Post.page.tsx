import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Center, Loader, Paper, Title } from '@mantine/core';
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
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>
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
