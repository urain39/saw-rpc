import { ARIA2 } from './index';

const aria2 = new ARIA2('ws://localhost:6800/jsonrpc', 'arcticfox');

(async function () {
    // const response = await aria2.tellStatus('6ded10d936091129', []);

    const response = await aria2.getPeers('6ded10d936091129');

    const [result, error] = response;

    console.log(result, error);
})();
