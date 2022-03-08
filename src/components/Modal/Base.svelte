<script lang="ts">
  // https://github.com/hnakamur/svelte-modal-example/blob/main/src/lib/Modal.svelte
  import { spring } from 'svelte/motion';
  import { fade, fly } from 'svelte/transition';

  /** Modal Visiblity */
  export let isOpen = false;
  /** Toggle Modal visibility */
  export let toggleIsOpen = (value: boolean) => {
    isOpen = value;
  };
  /** element to focus on after closing */
  export let focusAfterClosed: HTMLElement | undefined = undefined;

  let modalNode: HTMLElement;
  let ignoresFocusChange: boolean;
  let lastFocus: Element | null;

  const scale = spring(1);

  const modalAction = (node: HTMLElement) => {
    const focusableCandidateSelectors =
      'a[href]:not([tabindex^="-"])' +
      ',area[href]:not([tabindex^="-"])' +
      ',input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])' +
      ',input[type="radio"]:not([disabled]):not([tabindex^="-"])' +
      ',select:not([disabled]):not([tabindex^="-"])' +
      ',textarea:not([disabled]):not([tabindex^="-"])' +
      ',button:not([disabled]):not([tabindex^="-"])' +
      ',iframe:not([tabindex^="-"])' +
      ',audio[controls]:not([tabindex^="-"])' +
      ',video[controls]:not([tabindex^="-"])' +
      ',[contenteditable]:not([tabindex^="-"])' +
      ',[tabindex]:not([tabindex^="-"])' +
      ',details>summary:not([tabindex^="-"])' +
      ',details:not([tabindex^="-"])';

    const attemptFocus = (element: HTMLElement) => {
      ignoresFocusChange = true;
      try {
        element.focus();
      } catch {}
      ignoresFocusChange = false;
      return element === document.activeElement;
    };

    const focusFirstDescendant = (element: HTMLElement) => {
      if (element) {
        const descendants = element.querySelectorAll<HTMLElement>(focusableCandidateSelectors);
        for (let i = 0; i < descendants.length; i++) {
          const element = descendants[i];
          if (attemptFocus(element)) break;
        }
      }
    };
    const focusLastDescendant = (element: HTMLElement) => {
      if (element) {
        const descendants = element.querySelectorAll<HTMLElement>(focusableCandidateSelectors);
        for (let i = descendants.length - 1; i >= 0; i--) {
          if (attemptFocus(descendants[i])) break;
        }
      }
    };

    const trapFocus = (e: FocusEvent) => {
      if (ignoresFocusChange) return;
      if (modalNode.contains(e?.target as Element)) {
        lastFocus = e.target as Element;
      } else {
        focusFirstDescendant(modalNode);
        if (lastFocus === document.activeElement) {
          focusLastDescendant(modalNode);
        }
        lastFocus = document.activeElement;
      }
    };

    const keydown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        toggleIsOpen(false);
      }
    };

    let original: string;

    if (document.body.style.overflow !== 'hidden') {
      original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    document.addEventListener('focus', trapFocus, true);
    node.addEventListener('keydown', keydown);
    focusFirstDescendant(node);
    // node.focus();
    return {
      destroy: () => {
        document.body.style.overflow = original;
        document.removeEventListener('focus', trapFocus, true);
        node.removeEventListener('keydown', keydown);
        focusAfterClosed?.focus();
      }
    };
  };
</script>

{#if isOpen}
  <div class="modal" use:modalAction tabindex="-1" bind:this={modalNode}>
    <div class="backdrop" on:click={() => toggleIsOpen(false)} transition:fade />

    <div class="modal-dialog">
      <div class="content-wrapper" transition:fly={{ y: -100, duration: 300 }}>
        <div class="modal-header">
          <slot name="header" />
          <button
            class="absolute top-2 right-2 flex rounded-full font-bold hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:ring focus:ring-violet-300 dark:hover:text-slate-400 dark:focus:text-slate-400"
            on:click={() => toggleIsOpen(false)}
            on:mousedown={() => scale.set(0.8)}
            on:touchstart={() => scale.set(0.8)}
            on:mouseup={() => scale.set(1)}
            on:touchend={() => scale.set(1)}
            on:mouseenter={() => scale.set(1.3)}
            on:mouseleave={() => scale.set(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="inline-block h-6 w-6 hover:text-gray-500"
              style="vertical-align: -0.125em; transform: scale({$scale});"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <slot name="content" />
        </div>

        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style lang="postcss" global>
  div.modal {
    z-index: 10000;
    @apply fixed top-0 left-0 h-full w-full opacity-100;
  }
  div.backdrop {
    @apply absolute h-full w-full bg-black bg-opacity-40 dark:bg-gray-400 dark:bg-opacity-50;
  }
  div.modal-dialog {
    @apply relative z-10 m-2 flex h-[calc(100%-1rem)] min-h-[calc(100%-1rem)] items-center sm:mx-auto sm:my-7 sm:h-[calc(100%-3.5rem)] sm:min-h-[calc(100%-3.5rem)] sm:max-w-lg;
  }
  div.content-wrapper {
    @apply z-20 flex max-h-full w-full flex-col overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-800;
  }
  div.modal-body {
    @apply flex-1 overflow-auto p-3;
  }
  div.modal-header {
    @apply relative p-3;
  }
</style>
