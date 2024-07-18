import { codeVerifier, generateCodeChallenge } from '$lib/authHelper';
import applyBorderRadiusClip from './applyBorderRadiusClip';
import type { CurrentTrack } from './SpotifyTypes';
import { CLIENT_ID, CURRENT_PLAYING, REDIRECT_URI } from './constant';
import truncateText from './truncateText';
import { getImageData, kMeansDominantColors } from './Kmeans';

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
			const response = await fetch(CURRENT_PLAYING, requestOptions);
			if (response.status === 204) {
				return 204;
			}

			if (response.status === 401) {
				// Access token expired, re-authenticate
				await reAuthenticate();
				return;
			}

			const result: CurrentTrack = await response.json();
			const imageUrl = result.item?.album?.images?.[0]?.url || '';
			const songName = result.item?.name || 'Unknown Song';
			const artistNames =
				result.item?.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist';

			if (imageUrl) {
				const imageResponse = await fetch(imageUrl);
				const blob = await imageResponse.blob();
				const base64Image = await convertBlobToBase64(blob);

				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');

				const img = new Image();
				img.src = base64Image;

				img.onload = async () => {
					const width = 1600;
					const height = 900;
					const borderRadius = 80; // Adjust the border radius as needed
					canvas.width = width;
					canvas.height = height;
					if (!context) {
						return;
					}
					context.fillStyle = 'black';

					// Calculate the position to center the image but move it slightly to the left
					const imgX = (canvas.width - img.width) / 2 - 400; // Move 400px to the left
					const imgY = (canvas.height - img.height) / 2;

					// Extract the two most prominent colors from the image using K-means clustering
					context.drawImage(img, imgX, imgY);
					const imageData = getImageData(context, imgX, imgY, img.width, img.height);
					const colors = kMeansDominantColors(imageData, 2);

					// Create a linear gradient from the two colors
					const gradient = context.createLinearGradient(0, 0, width, height);
					gradient.addColorStop(0, colors[0]);
					gradient.addColorStop(1, colors[1]);
					context.fillStyle = gradient;
					context.fillRect(0, 0, width, height);

					// Apply the border radius clip path
					applyBorderRadiusClip(context, imgX, imgY, img.width, img.height, borderRadius);

					// Draw the image
					context.drawImage(img, imgX, imgY);

					// Restore the context to remove the clipping
					context.restore();

					// Draw the text with different font sizes and weights
					const textX = imgX + img.width + 50; // Position to the right of the image
					const lineHeight = 40; // Line height for the text
					const textHeight = lineHeight * 3; // Total height for three lines of text
					const textY = (canvas.height - textHeight) / 2 + lineHeight; // Center the text vertically
					const maxWidth = 800; // Maximum width for the text

					// First line with a larger font size and bold weight
					context.font = 'bold 40px Arial'; // Larger font size and bold weight for the first line
					context.fillStyle = 'white';
					context.textAlign = 'left';
					const truncatedName = truncateText(context, songName, maxWidth);
					context.fillText(truncatedName, textX, textY);

					// Second line with default font size and normal weight
					context.font = '24px Arial'; // Default font size and normal weight
					const truncatedArtist = truncateText(context, artistNames, maxWidth);
					context.fillText(truncatedArtist, textX, textY + 1 * lineHeight);

					// Third line with default font size and normal weight
					context.font = '24px Arial'; // Default font size and normal weight
					context.fillText('Listen on Spotify', textX, textY + 2 * lineHeight);

					// Construct the file name
					const fileName = `${songName}-${artistNames}.png`;

					// Convert the canvas to a Blob
					canvas.toBlob((blob) => {
						if (blob) {
							const link = document.createElement('a');
							link.href = URL.createObjectURL(blob);
							link.download = fileName;
							link.click();

							// Clean up the URL object after download
							URL.revokeObjectURL(link.href);
						}
					}, 'image/png');
				};

				return base64Image;
			} else {
				throw new Error('No image found in the current track');
			}
		} catch (error) {
			console.error('Failed to generate image:', error);
		}
	} else {
		await reAuthenticate();
	}
}

async function reAuthenticate() {
	const clientId = CLIENT_ID;
	const redirectUri = REDIRECT_URI;

	const scope = 'user-read-private user-read-email user-read-playback-state';
	const authUrl = new URL('https://accounts.spotify.com/authorize');

	localStorage.setItem('code_verifier', codeVerifier);
	const codeChallenge = await generateCodeChallenge();
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
