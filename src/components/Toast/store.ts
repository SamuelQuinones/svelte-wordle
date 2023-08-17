import { writable } from 'svelte/store';

export interface ToastObject {
	id: string;
	timeout: number;
	dismissible: boolean;
	message: string;
	type: 'success' | 'error' | 'info' | 'warn';
}

function createToastStore() {
	const { subscribe, update } = writable<ToastObject[]>([]);

	const dismiss = (id: string) => {
		update((state) => state.filter((toast) => toast.id !== id));
	};

	const show = ({
		id = crypto.randomUUID(),
		timeout = 3000,
		dismissible = true,
		message = 'Hello',
		type = 'success'
	}: Partial<ToastObject>) => {
		update((state) => {
			state.push({ id, timeout, dismissible, message, type });
			return state;
		});
		if (timeout > 0) setTimeout(() => dismiss(id), timeout);
	};

	return {
		subscribe,
		dismiss,
		show
	};
}

export const toastStore = createToastStore();
