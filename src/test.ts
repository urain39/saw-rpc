import { ARIA2 } from './index';

const aria2 = new ARIA2('ws://localhost:6800/jsonrpc', 'arcticfox');

(async function () {
    const response = await aria2.tellStatus('eadf4496ee8107c7', ['dir', 'status', 'bittorrent', 'errorCode']);

    const [result, error] = response;

    console.log(result, error);
})();
