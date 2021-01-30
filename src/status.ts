import { ARIA2GID } from './common';

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
    errorCode: string; // WTF?
    errorMessage: string;
    followedBy: ARIA2GID[];
    following: ARIA2GID;
    belongsTo: ARIA2GID;
    dir: string;
    files: string[];
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

export type ARIA2Status = { [key in keyof _ARIA2Status]?: _ARIA2Status[key]; }
