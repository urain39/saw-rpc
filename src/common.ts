import { ARIA2ErrorCode } from './errorCode';

export type ARIA2Optional<T> = { [key in keyof T]?: T[key] };

export type ARIA2Method =
    'aria2.addUri' | 'aria2.addTorrent' | 'aria2.getPeers' | 'aria2.addMetalink' | 'aria2.remove' |
    'aria2.pause' | 'aria2.forcePause' | 'aria2.pauseAll' | 'aria2.forcePauseAll' | 'aria2.unpause' |
    'aria2.unpauseAll' | 'aria2.forceRemove' | 'aria2.changePosition' | 'aria2.tellStatus' | 'aria2.getUris' |
    'aria2.getFiles' | 'aria2.getServers' | 'aria2.tellActive' | 'aria2.tellWaiting' | 'aria2.tellStopped' |
    'aria2.getOption' | 'aria2.changeUri' | 'aria2.changeOption' | 'aria2.getGlobalOption' | 'aria2.changeGlobalOption' |
    'aria2.purgeDownloadResult' | 'aria2.removeDownloadResult' | 'aria2.getVersion' | 'aria2.getSessionInfo' |
    'aria2.shutdown' | 'aria2.forceShutdown' | 'aria2.getGlobalStat' | 'aria2.saveSession' | 'system.multicall' |
    'system.listMethods' | 'system.listNotifications';

export type ARIA2NotifyMethod =
    'aria2.onDownloadStart' | 'aria2.onDownloadPause' |
    'aria2.onDownloadStop' | 'aria2.onDownloadComplete' |
    'aria2.onDownloadError' | 'aria2.onBtDownloadComplete';

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

export type SessionInfo = {
    sessionId: string;
};
