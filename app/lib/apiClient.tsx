export async function getCsrfToken() {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function apiClientOld(endpoint, options = {}) {

    // Default headers
    if (!options.headers) {
        options.headers = {};
    }
   // options.headers['Content-Type'] = 'application/json';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}


export async function apiClient(endpoint, options = {}) {

    const token = localStorage.getItem('accessToken');

    console.log('token');
    console.log(token);

 //  options.credentials = "include";
    // Default headers
    if (!options.headers) {
        options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${token}`;
    options.headers['Accept'] = 'application/json';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}

export async function apiClientCsrf(endpoint, options = {}) {
    await getCsrfToken();
    const xsrfToken = getCookie('XSRF-TOKEN');

    options.credentials = "include";
    // Default headers
    if (!options.headers) {
        options.headers = {};
    }
    options.headers['X-XSRF-TOKEN'] = xsrfToken;
    options.headers['Accept'] = 'application/json';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}
