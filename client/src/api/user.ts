//const base = import.meta.env.VITE_API_ENDPOINT;

export async function register(firstName: string, lastName: string, email: string, password: string, organization: string, fieldOfStudy: string, jobTitle: string, socialLinks: string[]) {
    console.log("firstName: ", firstName)
    console.log("lastName: ", lastName)
    console.log("email: ", email)
    console.log("password: ", password)
    console.log("organization: ", organization)
    console.log("fieldOfStudy: ", fieldOfStudy)

    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password, organization, fieldOfStudy, jobTitle, socialLinks }),
    }
    const response = await fetch(`http://localhost:5000/registeruser`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function login(email: string, password: string) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    }
    const response = await fetch(`http://localhost:5000/loginuser`, options);
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
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const response = await fetch(`http://localhost:5000/user`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}
