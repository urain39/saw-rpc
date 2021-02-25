import { ARIA2ErrorCode } from './errorCode';

export type ARIA2Optional<T> = { [key in keyof T]?: T[key] };

export type ARIA2Method =
    'addUri' | 'addTorrent' | 'getPeers' | 'addMetalink' | 'remove' |
    'pause' | 'forcePause' | 'pauseAll' | 'forcePauseAll' | 'unpause' |
    'unpauseAll' | 'forceRemove' | 'changePosition' | 'tellStatus' | 'getUris' |
    'getFiles' | 'getServers' | 'tellActive' | 'tellWaiting' | 'tellStopped' |
    'getOption' | 'changeUri' | 'changeOption' | 'getGlobalOption' | 'changeGlobalOption' |
    'purgeDownloadResult' | 'removeDownloadResult' | 'getVersion' | 'getSessionInfo' |
    'shutdown' | 'forceShutdown' | 'getGlobalStat' | 'saveSession' | 'system.multicall' |
    'system.listMethods' | 'system.listNotifications';

export type ARIA2NotifyMethod =
    'downloadStart' | 'downloadPause' |
    'downloadStop' | 'downloadComplete' |
    'downloadError' | 'btDownloadComplete';

export type ARIA2GID = string;

export type ARIA2Uri = {
    uri: string;
    status: 'used' | 'waiting';
};

export type ARIA2File = {
    index: number;
    path: string;
    length: number;
    completedLength: number;
    selected: boolean;
    uris: ARIA2Uri[];
};

export type ARIA2Status = {
    gid: ARIA2GID;
    status: 'active' | 'waiting' | 'paused' | 'error' | 'complete' | 'removed';
    totalLength: number;
    completedLength: number;
    uploadLength: number;
    bitfield: string;
    downloadSpeed: number;
    uploadSpeed: number;
    infoHash: string;
    numSeeders: number;
    seeder: boolean;
    pieceLength: number;
    numPieces: number;
    connections: number;
    errorCode: ARIA2ErrorCode;
    errorMessage: string;
    followedBy: ARIA2GID[];
    following: ARIA2GID;
    belongsTo: ARIA2GID;
    dir: string;
    files: ARIA2File[];
    bittorrent: {
        announceList: string[];
        comment: string;
        creationDate: number;
        mode: 'single' | 'multi';
        info: {
            name: string;
        };
    };
    verifiedLength: number;
    verifyIntegrityPending: boolean;
};

export type ARIA2Peer = {
    peerId: number;
    ip: string;
    port: number;
    bitfield: string;
    amChoking: boolean;
    peerChoking: boolean;
    downloadSpeed: number;
    uploadSpeed: number;
    seeder: boolean;
};

export type ARIA2Server = {
    index: number;
    servers: {
        uri: string;
        currentUri: string;
        downloadSpeed: number;
    }[];
};

export type ARIA2GlobalStat = {
    downloadSpeed: number;
    uploadSpeed: number;
    numActive: number;
    numWaiting: number;
    numStopped: number;
    numStoppedTotal: number;
}

export type ARIA2Version = {
    version: string;
    enabledFeatures: string[];
};

export type ARIA2Event = {
    gid: ARIA2GID;
};

export type ARIA2Error = {
    code: ARIA2ErrorCode;
    message: string;
};

export type SessionInfo = {
    sessionId: string;
};
