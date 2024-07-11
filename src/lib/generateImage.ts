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

		try {
			const response = await fetch(
				'https://api.spotify.com/v1/me/player/currently-playing',
				requestOptions
			);

			if (response.status === 401) {
				// Access token expired, re-authenticate
				reAuthenticate();
				return;
			}

			const result: CurrentTrack = await response.json();
			const imageUrl = result.item?.album?.images?.[0]?.url || '';

			if (imageUrl) {
				const imageResponse = await fetch(imageUrl);
				const blob = await imageResponse.blob();
				const base64Image = await convertBlobToBase64(blob);
				return base64Image;
			} else {
				throw new Error('No image found in the current track');
			}
		} catch (error) {
			console.error('Failed to generate image:', error);
		}
	} else {
		reAuthenticate();
	}
}

function reAuthenticate() {
	const clientId = '562519f36b3a4666b04648f2dd5b2dd4';
	const redirectUri = 'http://localhost:5173';

	const scope = 'user-read-private user-read-email user-read-playback-state';
	const authUrl = new URL('https://accounts.spotify.com/authorize');

	localStorage.setItem('code_verifier', codeVerifier);

	// Try to go to Spotify API
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

function convertBlobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}
