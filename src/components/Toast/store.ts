import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

type ToastProps = {
  id: string;
  timeout: number;
  dismissible: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warn';
};

const createToastStore = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { update, subscribe } = writable<ToastProps[]>([]);

  const dismiss = (id: string) => {
    update((state) => state.filter((toast) => toast.id !== id));
  };
  const show = ({
    id = uuidv4(),
    timeout = 3000,
    dismissible = true,
    message = 'Hello',
    type = 'success'
  }: Partial<ToastProps>) => {
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
};

export const toastStore = createToastStore();
