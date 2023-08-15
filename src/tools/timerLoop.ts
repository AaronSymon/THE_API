export function timerLoop(func: () => void, delay: number): NodeJS.Timeout {
    return setInterval(func, delay);
}
