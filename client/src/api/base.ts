export const base = import.meta.env.VITE_API_ENDPOINT ?? "http://localhost:5000";
const wsProtocol = base.includes('localhost') ? 'ws://' : 'wss://';
export const wsBase = base.replace(/https?:\/\//, wsProtocol);

const originalFetch = fetch;
// Override the global fetch
// To automatically handle token authentication
window.fetch = async (url, options = {}) => {
    const defaultHeaders = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json',
    };

    const headers = {
        ...defaultHeaders,
        ...(options.headers || {}),
    };

    return originalFetch(url, { ...options, headers });
};
