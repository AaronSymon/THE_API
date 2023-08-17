//Fonction timerLoop, permet d'exécuter une focntion à intervalle régulier
//Function timerLoop, allow to execute a function at regular interval
export function timerLoop(func: () => void, delay: number): NodeJS.Timeout {
    return setInterval(func, delay);
}
