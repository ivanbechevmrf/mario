export default function animationLoop(callback) {
    let prevTimestamp = performance.now();

    function caller(timestamp) {
        let timeDelta = timestamp - prevTimestamp;
        prevTimestamp = timestamp;

        callback(timeDelta);

        requestAnimationFrame(caller);
    }

    requestAnimationFrame(caller);
}
