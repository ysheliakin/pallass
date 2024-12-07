import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Center, Group, TextInput, Title } from '@mantine/core';
import { createPost } from '@/api/post';
import { useAppContext } from '@/app-context';
import { Layout } from '@/components/layout';
import { createEditor } from '@/components/TextEditor/editor';
import { TextEditor } from '@/components/TextEditor/TextEditor';

export function CreatePostPage() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const editor = createEditor({});

  const submit = async () => {
    const htmlContent = editor.getHTML();
    await createPost(user!.id, title, htmlContent);
    navigate('/dashboard');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      <Center>
        <div style={{ maxWidth: '800px' }}>
          <Center>
            <Title>New Post</Title>
          </Center>
          <br />
          <TextInput
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <br />
          <TextEditor editor={editor} />
          <br />
          <Group>
            <Button fullWidth variant="secondary" onClick={submit}>
              Submit
            </Button>
          </Group>
        </div>
      </Center>
    </Layout>
  );
}
