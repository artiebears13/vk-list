export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>): void {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    } as T;
}