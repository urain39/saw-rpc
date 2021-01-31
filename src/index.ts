import { JSONRPC, JSONRPCParams, JSONRPCHandler, ArgumentsType } from './lib/tinyrpc/index';
import {
    ARIA2Result, ARIA2GID, ARIA2Optional, ARIA2Status, ARIA2Uri, ARIA2File,
    ARIA2Peer, ARIA2Server, ARIA2Version, ARIA2GlobalStat
} from './common';
import { ARIA2Options } from './options';


type JSONRPCRequestArguments = ArgumentsType<typeof JSONRPC.prototype.request>;

type JSONRPCOnNotifyArguments = ArgumentsType<typeof JSONRPC.prototype.onNotify>;

type ARIA2Status_ = ARIA2Optional<ARIA2Status>;

type ARIA2Options_ = ARIA2Optional<ARIA2Options>;

type ARIA2StatusKey = keyof ARIA2Status;


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
    public addUri(uris: string[], options?: ARIA2Options_, position?: number): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, uris];

        if (options !== UNDEFINED) {
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
    public addTorrent(torrent: string, uris?: string[], options?: ARIA2Options_, position?: number): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, torrent];

        if (uris !== UNDEFINED) {
            params.push(uris);

            if (options !== UNDEFINED) {
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
    public addMetalink(metalink: string, options?: ARIA2Options_, position?: number): Promise<ARIA2Result<ARIA2GID>> {
        const params: JSONRPCParams = [this._secret, metalink];

        if (options !== UNDEFINED) {
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
    public tellStatus(gid: ARIA2GID, keys?: ARIA2StatusKey[]): Promise<ARIA2Result<ARIA2Status_>> {
        const params: JSONRPCParams = [this._secret, gid];

        if (keys !== UNDEFINED) {
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

    /**
     * 获取一个 Aria2 任务中的所有的 Peer。
     * @param gid 任务标识
     */
    public getPeers(gid: ARIA2GID): Promise<ARIA2Result<ARIA2Peer[]>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getPeers', params);
    }

    /**
     * 获取一个 Aria2 任务中所有的服务器。
     * @param gid 任务标识
     */
    public getServers(gid: ARIA2GID): Promise<ARIA2Result<ARIA2Server[]>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getServers', params);
    }

    /**
     * 获取 Aria2 中所有下载中的任务的状态。
     * @param keys 如果提供，则表示只响应`keys`里对应的值
     */
    public tellActive(keys?: ARIA2StatusKey[]): Promise<ARIA2Result<ARIA2Status_[]>> {
        const params: JSONRPCParams = [this._secret];

        if (keys !== UNDEFINED) {
            params.push(keys);
        }

        return this.request('aria2.tellActive', params);
    }

    /**
     * 获取 Aria2 中所有等待（包括暂停）的任务状态。
     * @param offset 起始偏移量（可以为负数，表示 length + offset）
     * @param num 个数（填 Number.MAX_SAFE_INTEGER 表示获取所有）
     * @param keys 如果提供，则表示只响应`keys`里对应的值
     */
    public tellWaiting(offset: number, num: number, keys?: ARIA2StatusKey[]): Promise<ARIA2Result<ARIA2Status_[]>> {
        const params: JSONRPCParams = [this._secret, offset, num];

        if (keys !== UNDEFINED) {
            params.push(keys);
        }

        return this.request('aria2.tellWaiting', params);
    }

    /**
     * 获取 Aria2 中所有已停止的任务状态。
     * @param offset 起始偏移量（可以为负数，表示 length + offset）
     * @param num 个数（填 Number.MAX_SAFE_INTEGER 表示获取所有）
     * @param keys 如果提供，则表示只响应`keys`里对应的值
     */
    public tellStopped(offset: Number, num: number, keys?: ARIA2StatusKey[]): Promise<ARIA2Result<ARIA2Status_[]>> {
        const params: JSONRPCParams = [this._secret, offset, num];

        if (keys !== UNDEFINED) {
            params.push(keys);
        }

        return this.request('aria2.tellStopped', params);
    }

    /**
     * 修改一个 Aria2 任务在下载列表中的位置。
     * @param gid 任务标识
     * @param offset 偏移量（可以为负数）
     * @param whence 从哪里开始
     * @returns 返回改变后的位置
     */
    public changePosition(gid: ARIA2GID, offset: number, whence: 'POS_CUR' | 'POS_SET' | 'POS_END'): Promise<ARIA2Result<number>> {
        const params: JSONRPCParams = [this._secret, gid, offset, whence];

        return this.request('aria2.changePosition', params);
    }

    /**
     * 修改一个 Aria2 任务中位于`fileIndex`位置的文件的下载链接列表。
     * @param gid 任务标识
     * @param fileIndex 文件索引（大于0）
     * @param delUris 需要删除的链接列表
     * @param addUris 需要添加的链接列表
     * @param position 添加在（已删除后的）链接列表中的位置（可为0）
     * @returns 返回一个元组，第一个元素表示已删除的个数，第二个表示已添加的个数。
     */
    public changeUri(gid: ARIA2GID, fileIndex: number, delUris: string[], addUris: string[], position?: number): Promise<ARIA2Result<[number, number]>> {
        const params: JSONRPCParams = [this._secret, gid, fileIndex, delUris, addUris];

        if (position !== UNDEFINED) {
            params.push(position);
        }

        return this.request('aria2.changeUri', params);
    }

    /**
     * 获取一个 Arai2 任务的选项。
     * @param gid 任务标识
     */
    public getOption(gid: ARIA2GID): Promise<ARIA2Result<ARIA2Options>> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getOption', params);
    }

    /**
     * 修改一个 Aria2 任务的选项。
     * @param gid 任务标识
     * @param options 覆盖已配置的选项
     */
    // TODO: 这里有一些需要禁用的选项，稍后我会通过其他方法过滤掉。
    public changeOption(gid: ARIA2GID, options: ARIA2Options_): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret, gid, options];

        return this.request('aria2.changeOption', params);
    }

    /**
     * 获取 Aria2 的全局选项。
     */
    public getGlobalOption(): Promise<ARIA2Result<ARIA2Options>> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getGlobalOption', params);
    }

    /**
     * 修改 Aria2 的全局选项。
     * @param options 覆盖已配置的选项
     */
    // TODO: 这里有一些需要禁用的选项，稍后我会通过其他方法过滤掉。
    public changeGlobalOption(options: ARIA2Options_): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret, options];

        return this.request('aria2.changeGlobalOption', params);
    }

    /**
     * 获取 Aria2 的全局统计信息。
     */
    public getGlobalStat(): Promise<ARIA2Result<ARIA2GlobalStat>> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getGlobalStat', params);
    }


    /**
     * 清除 Aria2 内存中已完成（包含错误、已移除）的结果，用于释放内存。
     */
    public purgeDownloadResult(): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.purgeDownloadResult', params);
    }

    /**
     * 通过指定的任务标识清除 Aria2 内存中已完成（包含错误、已移除）的结果，用于释放内存。
     * @param gid 任务标识
     */
    public removeDownloadResult(gid: ARIA2GID): Promise<ARIA2Result<"OK">> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.purgeDownloadResult', params);
    }

    /**
     * 获取 Aria2 的版本信息（包含特性）。
     */
    public getVersion(): Promise<ARIA2Result<ARIA2Version>> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getVersion', params);
    }
}
