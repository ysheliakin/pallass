import { base } from './base';

export interface Post {
  ID: number;
  UserID: number;
  Title: string;
  Content: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export async function createPost(userId: number, title: string, content: string) {
    const options = {
        method: 'POST',
        body: JSON.stringify({title, content, userId})
    }
    const response = await fetch(`${base}/post`, options);
    if (!response.ok) {
        console.error('Request failed: ', response);
    }
    return await response.json();
}

export async function getUserPosts(userId: number): Promise<Post[]> {
    const options = {
        method: 'GET',
    }
    const response = await fetch(`${base}/post/user/${userId}`, options);
    if (!response.ok) {
        console.error('Request failed: ', response);
    }
    return await response.json();
}

export async function getPost(postId: number) {
    const options = {
        method: 'GET',
    }
    const response = await fetch(`${base}/post/${postId}`, options);
    if (!response.ok) {
        console.error('Request failed: ', response);
    }
    return await response.json();
}
