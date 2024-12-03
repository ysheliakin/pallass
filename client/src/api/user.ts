import { base } from './base';

export async function register(firstName: string, lastName: string, email: string, password: string, organization: string, fieldOfStudy: string, jobTitle: string, socialLinks: string[]) {    
    const options = {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password, organization, fieldOfStudy, jobTitle, socialLinks }),
    }
    const response = await fetch(`${base}/registeruser`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function login(email: string, password: string) {
    const options = {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }
    const response = await fetch(`${base}/loginuser`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function getUser(token: string | null) {
    if (token === null) {
        return { ok: false, message: "JWT token not found" };
    }
    const options = {
        method: 'GET',
    }
    const response = await fetch(`${base}/user`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}
