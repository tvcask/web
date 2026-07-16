export type ToastOptions = {
  actionHref?: string;
};

export type ToastEvent = ToastOptions & {
  message: string;
};

type Listener = (event: ToastEvent) => void;

const listeners = new Set<Listener>();

export function toast(message: string, options: ToastOptions = {}) {
  listeners.forEach((listener) => listener({ message, ...options }));
}

export function onToast(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
