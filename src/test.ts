import { ARIA2 } from './index';

const aria2 = new ARIA2('ws://localhost:6800/jsonrpc', 'arcticfox');

(async function() {
    console.log(await aria2.unpauseAll());
})();