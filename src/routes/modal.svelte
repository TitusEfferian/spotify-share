<script lang="ts">
	export let show: boolean = false;
	export let closeModal: () => void;
	export let modalMessage = '';

	function handleClickOutside(event: MouseEvent) {
		if ((event.target as HTMLElement).id === 'modalOverlay') {
			closeModal();
		}
	}
</script>

{#if show}
	<div
		id="modalOverlay"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-start pt-16 justify-center z-50"
		on:click={handleClickOutside}
	>
		<div class="bg-gray-900 text-white p-8 rounded-lg shadow-lg relative">
			<button class="absolute top-2 right-2 text-gray-400 hover:text-white" on:click={closeModal}>
				&times;
			</button>
			<!-- <h2 class="text-2xl font-bold mb-4">{modalMessage}</h2> -->
			<p>{modalMessage}</p>
		</div>
	</div>
{/if}
