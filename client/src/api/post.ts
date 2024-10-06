const base = import.meta.env.VITE_API_ENDPOINT;

export async function createPost(title: string, content: string) {
    const options = {
        method: 'POST',
        body: JSON.stringify({title, content, user: 1}) // TODO: set user
    }
    const response = await fetch(`${base}/post`, options);
    if (!response.ok) {
        console.error('Request failed: ', response);
    }
    const result = await response.json();
    console.log(result);
    return result;
}
