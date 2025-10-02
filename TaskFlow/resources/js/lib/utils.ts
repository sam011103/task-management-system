import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from "sonner";
import { ReactNode } from 'react';


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play().catch(err => console.log("Audio blocked:", err));
};
  
// Toast with sound helper
export const toastWithSound = (
    type: "success" | "error" | "warning" | "info",
    message: ReactNode,
    description?: string
) => {
    switch (type)
    {
        case "success":
            toast.success(message, {
                description: description,
                duration: 4000,
                icon: '✅',
            })
            break;
        case "error":
            toast.error(message, {
                description: description,
                duration: 6000,
                icon: '⏰',
            })
            break;
        case "warning":
            toast.warning(message, {
                description: description,
                duration: 6000,
                icon: '⚡',
            })
            break;
        case "info":
            toast(message, {
                description: description,
                duration: 4000,
                icon: 'ℹ️',
            })
            break;
        default:
            toast(message, {
                description: description,
                duration: 4000,
                icon: '🔔',
            })
            break;
    }
    // playSound(`/sounds/${type}.mp3`);
    playSound('/sounds/notification.wav');
};