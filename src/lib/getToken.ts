import { CLIENT_ID, REDIRECT_URI } from './constant';

// src/lib/authService.js
const getToken = async (code = '') => {
	const codeVerifier = localStorage.getItem('code_verifier');

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			grant_type: 'authorization_code',
			code,
			redirect_uri: REDIRECT_URI,
			code_verifier: codeVerifier || '' // Handle null value
		})
	};

	const body = await fetch('https://accounts.spotify.com/api/token', payload);
	const response = await body.json();

	localStorage.setItem('access_token', response.access_token);
};
export default getToken;
