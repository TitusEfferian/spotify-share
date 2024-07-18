<script>
	import { generateImage } from '$lib/generateImage';
	import getToken from '$lib/getToken';
	import { onMount } from 'svelte';
	import Modal from './modal.svelte';

	let isLoading = false;
	let showModal = false;
	let modalMessage = '';

	// Run code when the component mounts
	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		if (code) {
			localStorage.setItem('auth_code', code);
			await getToken(code);
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	});

	function openModal(message = '') {
		showModal = true;
		modalMessage = message;
	}

	async function handleGenerateImage() {
		isLoading = true;
		try {
			const resp = await generateImage();
			if (resp === 204) {
				openModal('no current track listened');
			}
		} catch (error) {
			console.error('Failed to generate image:', error);
		} finally {
			isLoading = false;
		}
	}

	function closeModal() {
		showModal = false;
	}
</script>

<svelte:head>
	<title>Spotify Shareable Song Image Generator</title>
	<meta
		name="description"
		content="Easily create and share Spotify-style song images directly from the web. Generate beautiful, shareable visuals of your favorite songs just like Spotify's native app."
	/>
</svelte:head>

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
			<button
				id="generateButton"
				class="bg-[#1DB954] text-black font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
				on:click={handleGenerateImage}
			>
				{#if isLoading}
					Loading...
				{:else}
					Generate Shareable Image
				{/if}
			</button>
			<div id="imageContainer" class="mt-8">
				<!-- The generated image will be displayed here -->
			</div>
		</div>
	</div>
	<footer class="absolute bottom-2 text-sm text-white text-center">
		built with love by <a
			href="https://github.com/titusefferian"
			target="_blank"
			class="underline text-white font-bold">@titusefferian</a
		>,<br />assisted by ChatGPT-4o
	</footer>

	<!-- Modal Component -->
	<Modal show={showModal} {closeModal} {modalMessage} />
</div>
