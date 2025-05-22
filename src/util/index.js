export function throttle(func, wait) {
    // 上一次执行函数的时间戳，初始值为 0
    let lastTime = 0;

    // 返回一个闭包函数，作为节流后的函数
    return function (...args) {
        // 获取当前时间戳
        const now = Date.now();

        // 如果当前时间与上一次执行时间的差值大于等于 wait，则执行函数
        if (now - lastTime >= wait) {
            // 更新上一次执行函数的时间戳
            lastTime = now;
            // 调用原始函数，并传入参数
            func.apply(this, args);
        }
    };
}