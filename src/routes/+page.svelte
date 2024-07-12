<script>
	import { generateImage } from '$lib/generateImage';
	import getToken from '$lib/getToken';
	import { onMount } from 'svelte';

	let isLoading = false;

	// Run code when the component mounts
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		if (code) {
			localStorage.setItem('auth_code', code);
			await getToken(code);
		}
	});
	console.log(isLoading);
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
				on:click={async () => {
					isLoading = true;
					try {
						const base64 = await generateImage();
					} catch (error) {
						console.error('Failed to generate image:', error);
					} finally {
						isLoading = false;
					}
				}}
			>
				{isLoading ? 'Loading...' : 'Generate Shareable Image'}
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
