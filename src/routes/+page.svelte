<script>
	import { codeChallenge, codeVerifier } from '$lib/authHelper';
	import { onMount } from 'svelte';

	const getToken = async (code) => {
		// stored in the previous step
		let codeVerifier = localStorage.getItem('code_verifier');

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
				code_verifier: codeVerifier
			})
		};

		const body = await fetch('https://accounts.spotify.com/api/token', payload);
		const response = await body.json();

		localStorage.setItem('access_token', response.access_token);
	};

	// Define the function to be called when the button is clicked
	async function generateImage() {
		const authCode = localStorage.getItem('access_token');

		if (authCode) {
            const myHeaders = new Headers();
		myHeaders.append(
			'Authorization',
			`Bearer ${localStorage.getItem('access_token')}`
		);

		const requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		fetch('https://api.spotify.com/v1/me/player/currently-playing', requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
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

	// Use onMount to run code when the component mounts
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
