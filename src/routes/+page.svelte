<script>
	import { codeChallenge, codeVerifier } from '$lib/authHelper';
	import { onMount } from 'svelte';

	// Function to get the access token using the authorization code
	const getToken = async (code='') => {
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
				code_verifier: codeVerifier || '',
			})
		};

		const response = await fetch('https://accounts.spotify.com/api/token', payload);
		const data = await response.json();

		localStorage.setItem('access_token', data.access_token);
	};

	// Function to generate an image of the current song
	async function generateImage() {
		const accessToken = localStorage.getItem('access_token');

		if (accessToken) {
			const headers = new Headers();
			headers.append('Authorization', `Bearer ${accessToken}`);

			const requestOptions = {
				method: 'GET',
				headers: headers,
			};

			fetch('https://api.spotify.com/v1/me/player/currently-playing', requestOptions)
				.then((response) => response.json())
				.then((result) => {
					// Handle the result to generate the image
					console.log(result);
				})
				.catch((error) => console.error('Error:', error));
		} else {
			const clientId = '562519f36b3a4666b04648f2dd5b2dd4';
			const redirectUri = 'http://localhost:5173';

			const scope = 'user-read-private user-read-email user-read-playback-state';
			const authUrl = new URL('https://accounts.spotify.com/authorize');

			localStorage.setItem('code_verifier', codeVerifier);

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

	// Run code when the component mounts
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		if (code) {
			localStorage.setItem('auth_code', code);
			await getToken(code);
		}
	});
</script>

<div
	class="bg-gradient-to-br from-[#1DB954] to-[#191414] min-h-screen flex flex-col items-center justify-center relative"
>
	<div class="container mx-auto px-4 text-center">
		<div
			class="bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg"
		>
			<h1 class="text-white text-5xl font-extrabold mb-8">Spotify Song Share</h1>
			<p class="text-white text-lg mb-8">
				Click the button below to generate a shareable image of your current song.
			</p>
			<!-- Bind the generateImage function to the button's click event -->
			<button
				id="generateButton"
				class="bg-[#1DB954] text-black font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
				on:click={generateImage}
			>
				Generate Shareable Image
			</button>
			<div id="imageContainer" class="mt-8">
				<!-- The generated image will be displayed here -->
			</div>
		</div>
	</div>
	<footer class="absolute bottom-2 text-sm text-white text-center">
		built with love by @titusefferian,<br />assisted by ChatGPT-4o
	</footer>
</div>
