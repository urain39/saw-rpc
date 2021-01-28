import { JSONRPC, JSONRPCParams, JSONRPCHandler, ArgumentsType } from './lib/tinyrpc';
import { ARIA2Options } from './aria2Options';

type JSONRPCRequestArguments = ArgumentsType<typeof JSONRPC.prototype.request>;

type JSONRPCHandlerArguments = ArgumentsType<JSONRPCHandler>;

type JSONRPCOnNotifyArguments = ArgumentsType<typeof JSONRPC.prototype.onNotify>;


const UNDEFINED = void 0;


export class ARIA2 {
    private _rpcPath: string;
    private _secret: string;
    private _jsonrpc: JSONRPC;

    public constructor(rpcPath: string, secret: string) {
        this._rpcPath = rpcPath;
        this._secret = `token:${secret}`;
        this._jsonrpc = new JSONRPC(rpcPath);
    }

    /**
     * 添加收到通知时的回调。
     */
    public onNotify(...args: JSONRPCOnNotifyArguments): void {
        this._jsonrpc.onNotify(...args);
    }

    /**
     * 请求底层方法。注意：该请求可能会被拒绝。
     * @param method 方法名称
     */
    public request(method: string, ...args: JSONRPCRequestArguments extends [string, ...infer T, JSONRPCHandler, boolean?] ? T : any[]): Promise<JSONRPCHandlerArguments> {
        const jsonrpc = this._jsonrpc;

        return new Promise<JSONRPCHandlerArguments>(function (resolve: (value: JSONRPCHandlerArguments) => any): any {
            jsonrpc.request(method, ...args, (...args: JSONRPCHandlerArguments): any => resolve(args));
        });
    }

    /**
     * 添加链接到 Aria2。注意：`position`需要有`options`才会判断。
     * @param uris 同一文件的多个下载链接
     * @param options 覆盖已配置的选项
     * @param position 该任务在下载列表中的位置
     */
    public addUri(uris: string[], options?: ARIA2Options, position?: number): Promise<JSONRPCHandlerArguments> {
        const params: JSONRPCParams = [];

        const secret = this._secret;
        if (secret) {
            params.push(secret);
        }

        params.push(uris);

        if (options) {
            params.push(options);

            if (position !== UNDEFINED) {
                params.push(position);
            }
        }

        return this.request('aria2.addUri', params);
    }

    /**
     * 添加种子文件到 Aria2。注意：`options`需要有`uris`才会判断；
     * `position`需要有`options`才会判断。
     * @param torrent 种子文件内容（base64编码后）
     * @param uris 与种子文件对应的 Web-Seeding 连接
     * @param options 覆盖已配置的选项
     * @param position 该任务在下载列表中的位置
     */
    public addTorrent(torrent: string, uris?: string[], options?: ARIA2Options, position?: number) {
        const params: JSONRPCParams = [];

        const secret = this._secret;
        if (secret) {
            params.push(secret);
        }

        params.push(torrent);

        if (uris) {
            params.push(uris);

            if (options) {
                params.push(options);

                if (position !== UNDEFINED) {
                    params.push(position);
                }
            }
        }

        return this.request('aria2.addTorrent', params);
    }

    public addMetalink(metalink: string, options?: ARIA2Options, position?: number) {
        const params: JSONRPCParams = [];

        const secret = this._secret;
        if (secret) {
            params.push(secret);
        }

        params.push(metalink);

        if (options) {
            params.push(options);

            if (position !== UNDEFINED) {
                params.push(position);
            }
        }
    }
}

