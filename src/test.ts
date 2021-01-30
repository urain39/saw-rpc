import { ARIA2 } from './index';

const aria2 = new ARIA2('ws://localhost:6800/jsonrpc', 'arcticfox');

(async function() {
    console.log(await aria2.tellStatus('72af75660910724e', ['dir', 'status']));
})();