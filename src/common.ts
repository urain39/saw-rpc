import { JSONRPCHandler, ArgumentsType } from './lib/tinyrpc/index';

export type ARIA2Result<T> = ArgumentsType<JSONRPCHandler> extends [any, ...infer R] ? [T, ...R] : any[];

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

type _ARIA2Status = {
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
    errorCode: number;
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

export type ARIA2Status = { [key in keyof _ARIA2Status]?: _ARIA2Status[key]; };

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
