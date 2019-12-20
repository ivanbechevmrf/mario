import gameInit from './script';

(async function gameStart() {
    const run = await gameInit();
    run();
})();
