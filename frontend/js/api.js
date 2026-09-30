const API_BASE = 'http://localhost:8081';

const API = {
    getHeaders() {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        return headers;
    },

    async get(path) {
        const response = await fetch(API_BASE + path, {
            method: 'GET',
            headers: this.getHeaders()
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }
        return response.json();
    },

    async post(path, body) {
        const response = await fetch(API_BASE + path, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        if (response.status === 401 && path !== '/api/auth/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }
        return response.json();
    },

    async put(path, body) {
        const response = await fetch(API_BASE + path, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }
        return response.json();
    },

    async delete(path) {
        const response = await fetch(API_BASE + path, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }
        return response.json();
    },

    async downloadPdf(path) {
        const response = await fetch(API_BASE + path, {
            method: 'GET',
            headers: this.getHeaders()
        });
        if (!response.ok) throw new Error('PDF generation failed');
        return response.blob();
    }
};
