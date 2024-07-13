// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
const generateRandomString = (length) => {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const codeVerifier = generateRandomString(64);

const sha256 = async (plain) => {
	if (typeof window === 'undefined') {
		return;
	}
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input) => {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
};

const generateCodeChallenge = async () => {
	const hashed = await sha256(codeVerifier);
	return base64encode(hashed);
};

export { codeVerifier, generateCodeChallenge };
