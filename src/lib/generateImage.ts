// src/lib/imageService.js
import { codeChallenge, codeVerifier } from '$lib/authHelper';
import type { CurrentTrack } from './SpotifyTypes';

export async function generateImage() {
	const authCode = localStorage.getItem('access_token');

	if (authCode) {
		const myHeaders = new Headers();
		myHeaders.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

		const requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow' as RequestRedirect // Explicitly cast to RequestRedirect
		};

		fetch('https://api.spotify.com/v1/me/player/currently-playing', requestOptions)
			.then((response) => response.json())
			.then((result:CurrentTrack) => {
				const imageUrl = result.item?.album?.images?.[0].url || '';
				// how to convert this to a base64 image?
			})
			.catch((error) => console.error(error));
	} else {
		const clientId = '562519f36b3a4666b04648f2dd5b2dd4';
		const redirectUri = 'http://localhost:5173';

		const scope = 'user-read-private user-read-email user-read-playback-state';
		const authUrl = new URL('https://accounts.spotify.com/authorize');

		localStorage.setItem('code_verifier', codeVerifier);

		// try to go to spotify api
		const params = {
			response_type: 'code',
			client_id: clientId,
			scope,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			redirect_uri: redirectUri
		};

		authUrl.search = new URLSearchParams(params).toString();
		window.location.href = authUrl.toString();
	}
}
