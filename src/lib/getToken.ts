// src/lib/authService.js
const getToken = async (code = '') => {
	const codeVerifier = localStorage.getItem('code_verifier');

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: '562519f36b3a4666b04648f2dd5b2dd4',
			grant_type: 'authorization_code',
			code,
			redirect_uri: 'http://localhost:5173',
			code_verifier: codeVerifier || '' // Handle null value
		})
	};

	const body = await fetch('https://accounts.spotify.com/api/token', payload);
	const response = await body.json();

	localStorage.setItem('access_token', response.access_token);
};
export default getToken;
