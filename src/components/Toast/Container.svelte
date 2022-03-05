<script lang="ts">
  import { toastStore } from './store';
  import Toast from './Toast.svelte';
</script>

{#if $toastStore.length > 0}
  <section class="fixed top-7 left-0 right-0 z-[100001] mt-4 flex w-full flex-col justify-center">
    {#each $toastStore as toast (toast.id)}
      <Toast
        dismissible={toast.dismissible}
        type={toast.type}
        on:dismiss={() => toastStore.dismiss(toast.id)}
      >
        {toast.message}
      </Toast>
    {/each}
  </section>
{/if}
