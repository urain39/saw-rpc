import { JSONRPC, JSONRPCParams, JSONRPCHandler, ArgumentsType } from './lib/tinyrpc/index';
import { ARIA2Result, ARIA2GID, ARIA2Status, ARIA2Uri, ARIA2File, ARIA2Peer } from './common';
import { ARIA2Options } from './options';


type JSONRPCRequestArguments = ArgumentsType<typeof JSONRPC.prototype.request>;

type JSONRPCOnNotifyArguments = ArgumentsType<typeof JSONRPC.prototype.onNotify>;


const UNDEFINED = void 22;


export class ARIA2 {
    public rpcPath: string;
    private _secret: string;
    private _jsonrpc: JSONRPC;

    public constructor(rpcPath: string, secret: string) {
        this.rpcPath = rpcPath;
        this._secret = `token:${secret}`;

        function _preprocess(value: string): string | number | boolean | null {
            const l = value.length;

            if (l > 0 && l <= 20) {
                const n = Number(value);

                if (n || n === 0)
                    return n;

                if (value === 'true')
                    return true;

                if (value === 'false')
                    return false;

                if (value === 'null')
                    return null;
            }

            return value;
        }

        function preprocess(object: any): any {
            let value: any,
                type: string;

            for (const key in object) {
                value = object[key];
                type = typeof value;

                if (type === 'string') {
                    object[key] = _preprocess(value);
                } else if (type === 'object') {
                    preprocess(value);
                }
            }

            return object;
        }

        this._jsonrpc = new JSONRPC(rpcPath, preprocess);
    }

    /**
     * 添加收到通知时的回调。
     */
    public onNotify(...args: JSONRPCOnNotifyArguments): void {
        this._jsonrpc.onNotify(...args);
    }

    /**
     * 底层请求方法。注意：该请求可能会被拒绝。
     * @param method 方法名称
     */
    public request(method: string, ...rest: JSONRPCRequestArguments extends [string, ...infer R, JSONRPCHandler, boolean?] ? R : any[]): Promise<ARIA2Result<any>> {
        const jsonrpc = this._jsonrpc;

        return new Promise<ARIA2Result<any>>(function (resolve: (value: ARIA2Result<any>) => any) {
            jsonrpc.request(method, ...rest, (...args: ARIA2Result<any>) => resolve(args));
        });
    }

    /**
     * 添加链接到 Aria2。注意：`position`需要有`options`才会判断。
     * @param uris 同一文件的多个下载链接
     * @param options 覆盖已配置的选项
     * @param position 该任务在下载列表中的位置
     */
    public addUri(uris: string[], options?: ARIA2Options, position?: number): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, uris];

        if (options) {
            params.push(options);

            if (position !== UNDEFINED) {
                params.push(position);
            }
        }

        return this.request('aria2.addUri', params);
    }

    /**
     * 添加 torrent 到 Aria2。注意：`options`需要有`uris`才会判断；
     * `position`需要有`options`才会判断。
     * @param torrent torrent 文件内容（base64编码后）
     * @param uris 与 torrent 文件对应的 Web-Seeding 连接
     * @param options 覆盖已配置的选项
     * @param position 该任务在下载列表中的位置
     */
    public addTorrent(torrent: string, uris?: string[], options?: ARIA2Options, position?: number): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, torrent];

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

    /**
     * 添加 Metalink 到 Aria2。注意：`options`需要有`uris`才会判断。
     * @param metalink MetaLink 文件内容（base64编码后）
     * @param options 覆盖已配置的选项
     * @param position 该任务在下载列表中的位置
     */
    public addMetalink(metalink: string, options?: ARIA2Options, position?: number): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, metalink];

        if (options) {
            params.push(options);

            if (position !== UNDEFINED) {
                params.push(position);
            }
        }

        return this.request('aria2.addMetalink', params);
    }

    /**
     * 从 Aria2 移除一个任务。
     * @param gid 任务的标识
     */
    public remove(gid: ARIA2GID): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.remove', params);
    }

    /**
     * 从 Aria2 **强制**移除一个任务。
     * @param gid 任务的标识
     */
    public forceRemove(gid: ARIA2GID): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.forceRemove', params);
    }

    /**
     * 暂停一个 Aria2 任务。
     * @param gid 任务的标识
     */
    public pause(gid: ARIA2GID): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.pause', params);
    }

    /**
     * 暂停所有的 Aria2 任务。
     */
    public pauseAll(): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.pauseAll', params);
    }

    /**
     * **强制**暂停一个 Aria2 任务。
     * @param gid 任务的标识
     */
    public forcePause(gid: ARIA2GID): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.forcePause', params);
    }

    /**
     * **强制**暂停所有的 Aria2 任务。
     */
    public forcePauseAll(): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.forcePauseAll', params);
    }

    /**
     * 取消暂停一个 Aria2 任务。
     * @param gid 任务的标识
     */
    public unpause(gid: ARIA2GID): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.unpause', params);
    }

    /**
     * 取消暂停所有的 Aria2 任务。
     */
    public unpauseAll(): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.unpauseAll', params);
    }

    /**
     * 获取一个 Aria2 任务的状态。
     * @param gid 任务的标识
     * @param keys 如果提供，则表示只响应`keys`里对应的值
     */
    public tellStatus(gid: ARIA2GID, keys?: (keyof ARIA2Status)[]): Promise<ARIA2Result<ARIA2Status>> {
        const params: JSONRPCParams = [this._secret, gid];

        if (keys) {
            params.push(keys);
        }

        return this.request('aria2.tellStatus', params);
    }

    /**
     * 获取一个 Aria2 任务的所有可用链接。
     * @param gid 任务标识
     */
    public getUris(gid: ARIA2GID): Promise<ARIA2Result<ARIA2Uri[]>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getUris', params);
    }

    /**
     * 获取一个 Aria2 任务中的所有文件。
     * @param gid 任务标识
     */
    public getFiles(gid: ARIA2GID): Promise<ARIA2Result<ARIA2File[]>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getFiles', params);
    }

    public getPeers(gid: ARIA2GID): Promise<ARIA2Result<ARIA2Peer[]>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getPeers', params);
    }
}
