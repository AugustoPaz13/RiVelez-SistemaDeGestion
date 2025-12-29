
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';

export const toast = sonnerToast;

export const Toaster = () => {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                style: {
                    fontSize: '1rem',
                    padding: '1rem 1.25rem',
                    minHeight: '4rem',
                },
                className: 'text-base',
            }}
        />
    );
};
