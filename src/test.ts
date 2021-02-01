import { ARIA2 } from './index';

const aria2 = new ARIA2('ws://localhost:6800/jsonrpc', 'arcticfox');

(async function () {
    let result: unknown;

    try {
        // result = await aria2.changeOption('0000000000000000', {
        //     'max-download-limit': '2M',
        //     'max-upload-limit': '2M'
        // });
        result = await aria2.request('system.listMethods', undefined);
    } catch (e) {
        console.log('Error: ', e)
    }

    console.log(result);
})();
