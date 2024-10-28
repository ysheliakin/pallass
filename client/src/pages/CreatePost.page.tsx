import { useState } from 'react';
import { Button, Center, TextInput, Title } from '@mantine/core';
import { createPost } from '../api/post';
import { createEditor } from '../components/TextEditor/editor';
import { TextEditor } from '../components/TextEditor/TextEditor';

export function CreatePostPage() {
  const [title, setTitle] = useState('');
  const editor = createEditor({});

  const submit = () => {
    const htmlContent = editor.getHTML();
    console.log({ title, htmlContent });
    createPost(title, htmlContent);
  };

  return (
    <Center>
      <div style={{ maxWidth: '800px' }}>
        <Title>New Post</Title>
        <br />
        <TextInput
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <br />
        <TextEditor editor={editor} />
        <br />
        <Button fullWidth variant="primary" onClick={submit}>
          Submit
        </Button>
      </div>
    </Center>
  );
}
