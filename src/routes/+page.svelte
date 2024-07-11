<script>
	import { codeChallenge, codeVerifier } from "$lib/authHelper";

    // Define the function to be called when the button is clicked
    async function generateImage() {
        const clientId = '562519f36b3a4666b04648f2dd5b2dd4';
        const redirectUri = 'http://localhost:5173';

        const scope = 'user-read-private user-read-email user-read-playback-state';
        const authUrl = new URL("https://accounts.spotify.com/authorize");        

        localStorage.setItem('code_verifier', codeVerifier);


        // try to go to spotify api
        const params = {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }
  </script>
  
  <div class="bg-gradient-to-br from-[#1DB954] to-[#191414] min-h-screen flex flex-col items-center justify-center relative">
      <div class="container mx-auto px-4 text-center">
          <div class="bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg">
              <h1 class="text-white text-5xl font-extrabold mb-8">Spotify Song Share</h1>
              <p class="text-white text-lg mb-8">Click the button below to generate a shareable image of your current song.</p>
              <!-- Bind the generateImage function to the button's click event -->
              <button id="generateButton" class="bg-[#1DB954] text-black font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300" on:click={generateImage}>
                  Generate Shareable Image
              </button>
              <div id="imageContainer" class="mt-8">
                  <!-- The generated image will be displayed here -->
              </div>
          </div>
      </div>
      <footer class="absolute bottom-2 text-sm text-white text-center">
          built with love by @titusefferian,<br>assisted by ChatGPT-4o
      </footer>
  </div>