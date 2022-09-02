export const intervalPromise = (callback, maxCallsAmount, milliseconds) => {
    let callsAmount = 0;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (callsAmount > maxCallsAmount) {
                clearInterval(interval);
                resolve();
            } else if (callsAmount <= maxCallsAmount) {
                callback(callsAmount);
                callsAmount++;
            }
        }, milliseconds);
    });
};
