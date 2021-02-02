import {
    JSONRPC, JSONRPCParams, JSONRPCError
} from './lib/tinyrpc/index';
import {
    ARIA2Method, ARIA2NotifyMethod, ARIA2GID, ARIA2Optional, ARIA2Status,
    ARIA2Uri, ARIA2File, ARIA2Peer, ARIA2Server, ARIA2Version, ARIA2GlobalStat,
    ARIA2Event, SessionInfo
} from './common';
import { ARIA2Options, ARIA2OptionsWithout } from './options';

// 导出所有类型注解。
export * from './common';
export * from './options';
export * from './errorCode';


type ARIA2Status_ = ARIA2Optional<ARIA2Status>;

type ARIA2Options_ = ARIA2Optional<ARIA2Options>;

type ARIA2StatusKey = keyof ARIA2Status;

type ARIA2ChangeOptionBlocked =
    'dry-run' | 'metalink-base-uri' | 'parameterized-uri' | 'pause' | 'piece-length' | 'rpc-save-upload-metadata';

type ARIA2ChangeGlobalOptionBlocked =
    'checksum' | 'index-out' | 'out' | 'pause' | 'select-file';


const UNDEFINED = void 22;
const RE_PATH_SEPARATOR = /[/\\]/;


export class ARIA2 {
    public rpcPath: string;
    private _secret: string;
    private _jsonrpc: JSONRPC;

    /**
     * 从`ARIA2File`中提取标题名。
     */
    public static getTitleName(file: ARIA2File, dir: string): string {
        return file.path.slice(dir.length + (RE_PATH_SEPARATOR.test(dir.slice(-1)) ? 0 : 1)).split(RE_PATH_SEPARATOR)[0];
    }

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
    public onNotify(notifyMethod: ARIA2NotifyMethod, notifier: (event: ARIA2Event) => any): void {
        this._jsonrpc.onNotify(notifyMethod, function (params: JSONRPCParams) {
            if (params !== UNDEFINED) {
                notifier(params[0] as ARIA2Event);
            }
        });
    }

    /**
     * 底层请求方法。注意：该请求可能会被拒绝。
     * @param method 方法名称
     */
    public request(method: ARIA2Method, params: JSONRPCParams): Promise<any> {
        const jsonrpc = this._jsonrpc;

        return new Promise<any>(function (resolve: (result: any) => any, reject: (error: JSONRPCError) => any) {
            jsonrpc.request(method, params, (result: any, error?: JSONRPCError) => {
                error ? reject(error) : resolve(result);
            });
        });
    }

    /**
     * 添加链接到 Aria2。注意：`position`需要有`options`才会判断。
     * @param uris 同一文件的多个下载链接
     * @param options 覆盖已配置的选项
     * @param position 该任务在下载列表中的位置
     */
    public addUri(uris: string[], options?: ARIA2Options_, position?: number): Promise<ARIA2GID> {
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
    public addTorrent(torrent: string, uris?: string[], options?: ARIA2Options_, position?: number): Promise<ARIA2GID> {
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
    public addMetalink(metalink: string, options?: ARIA2Options_, position?: number): Promise<ARIA2GID> {
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
    public remove(gid: ARIA2GID): Promise<ARIA2GID> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.remove', params);
    }

    /**
     * 从 Aria2 **强制**移除一个任务。
     * @param gid 任务的标识
     */
    public forceRemove(gid: ARIA2GID): Promise<ARIA2GID> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.forceRemove', params);
    }

    /**
     * 暂停一个 Aria2 任务。
     * @param gid 任务的标识
     */
    public pause(gid: ARIA2GID): Promise<ARIA2GID> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.pause', params);
    }

    /**
     * 暂停所有的 Aria2 任务。
     */
    public pauseAll(): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.pauseAll', params);
    }

    /**
     * **强制**暂停一个 Aria2 任务。
     * @param gid 任务的标识
     */
    public forcePause(gid: ARIA2GID): Promise<ARIA2GID> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.forcePause', params);
    }

    /**
     * **强制**暂停所有的 Aria2 任务。
     */
    public forcePauseAll(): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.forcePauseAll', params);
    }

    /**
     * 取消暂停一个 Aria2 任务。
     * @param gid 任务的标识
     */
    public unpause(gid: ARIA2GID): Promise<ARIA2GID> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.unpause', params);
    }

    /**
     * 取消暂停所有的 Aria2 任务。
     */
    public unpauseAll(): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.unpauseAll', params);
    }

    /**
     * 获取一个 Aria2 任务的状态。
     * @param gid 任务的标识
     * @param keys 如果提供，则表示只响应`keys`里对应的值
     */
    public tellStatus(gid: ARIA2GID, keys?: ARIA2StatusKey[]): Promise<ARIA2Status_> {
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
    public getUris(gid: ARIA2GID): Promise<ARIA2Uri[]> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getUris', params);
    }

    /**
     * 获取一个 Aria2 任务中的所有文件。
     * @param gid 任务标识
     */
    public getFiles(gid: ARIA2GID): Promise<ARIA2File[]> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getFiles', params);
    }

    /**
     * 获取一个 Aria2 任务中的所有的 Peer。
     * @param gid 任务标识
     */
    public getPeers(gid: ARIA2GID): Promise<ARIA2Peer[]> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getPeers', params);
    }

    /**
     * 获取一个 Aria2 任务中所有的服务器。
     * @param gid 任务标识
     */
    public getServers(gid: ARIA2GID): Promise<ARIA2Server[]> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getServers', params);
    }

    /**
     * 获取 Aria2 中所有下载中的任务的状态。
     * @param keys 如果提供，则表示只响应`keys`里对应的值
     */
    public tellActive(keys?: ARIA2StatusKey[]): Promise<ARIA2Status_[]> {
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
    public tellWaiting(offset: number, num: number, keys?: ARIA2StatusKey[]): Promise<ARIA2Status_[]> {
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
    public tellStopped(offset: Number, num: number, keys?: ARIA2StatusKey[]): Promise<ARIA2Status_[]> {
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
    public changePosition(gid: ARIA2GID, offset: number, whence: 'POS_CUR' | 'POS_SET' | 'POS_END'): Promise<number> {
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
    public changeUri(gid: ARIA2GID, fileIndex: number, delUris: string[], addUris: string[], position?: number): Promise<[number, number]> {
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
    public getOption(gid: ARIA2GID): Promise<ARIA2Options> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.getOption', params);
    }

    /**
     * 修改一个 Aria2 任务的选项。
     * @param gid 任务标识
     * @param options 覆盖已配置的选项
     */
    public changeOption(gid: ARIA2GID, options: ARIA2Optional<ARIA2OptionsWithout<ARIA2ChangeOptionBlocked>>): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret, gid, options];

        return this.request('aria2.changeOption', params);
    }

    /**
     * 获取 Aria2 的全局选项。
     */
    public getGlobalOption(): Promise<ARIA2Options> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getGlobalOption', params);
    }

    /**
     * 修改 Aria2 的全局选项。
     * @param options 覆盖已配置的选项
     */
    public changeGlobalOption(options: ARIA2Optional<ARIA2OptionsWithout<ARIA2ChangeGlobalOptionBlocked>>): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret, options];

        return this.request('aria2.changeGlobalOption', params);
    }

    /**
     * 获取 Aria2 的全局统计信息。
     */
    public getGlobalStat(): Promise<ARIA2GlobalStat> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getGlobalStat', params);
    }

    /**
     * 清除 Aria2 内存中已完成（包含错误、已移除）的结果，用于释放内存。
     */
    public purgeDownloadResult(): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.purgeDownloadResult', params);
    }

    /**
     * 通过指定的任务标识清除 Aria2 内存中已完成（包含错误、已移除）的结果，用于释放内存。
     * @param gid 任务标识
     */
    public removeDownloadResult(gid: ARIA2GID): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret, gid];

        return this.request('aria2.purgeDownloadResult', params);
    }

    /**
     * 获取 Aria2 的版本信息（包含特性）。
     */
    public getVersion(): Promise<ARIA2Version> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getVersion', params);
    }

    /**
     * 获取 Aria2 的会话信息。
     */
    public getSessionInfo(): Promise<SessionInfo> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.getSessionInfo', params);
    }

    /**
     * 保存当前会话到指定的会话文件。
     */
    public saveSession(): Promise<'OK'> {
        const params: JSONRPCParams = [this._secret];

        return this.request('aria2.saveSession', params);
    }
}
