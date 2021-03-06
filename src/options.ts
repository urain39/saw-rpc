import { ARIA2GID } from './common';

export type ARIA2Options = {
    'all-proxy': string;
    'all-proxy-passwd': string;
    'all-proxy-user': string;
    'allow-overwrite': boolean;
    'allow-piece-length-change': boolean;
    'always-resume': boolean;
    'async-dns': boolean;
    'auto-file-renaming': boolean;
    'bt-enable-hook-after-hash-check': boolean;
    'bt-enable-lpd': boolean;
    'bt-exclude-tracker': string;
    'bt-external-ip': string;
    'bt-force-encryption': boolean;
    'bt-hash-check-seed': boolean;
    'bt-load-saved-metadata': boolean;
    'bt-max-peers': number;
    'bt-metadata-only': boolean;
    'bt-min-crypto-level': 'plain' | 'arc4';
    'bt-prioritize-piece': string;
    'bt-remove-unselected-file': boolean;
    'bt-request-peer-speed-limit': string;
    'bt-require-crypto': boolean;
    'bt-save-metadata': boolean;
    'bt-seed-unverified': boolean;
    'bt-stop-timeout': number;
    'bt-tracker': string;
    'bt-tracker-connect-timeout': number;
    'bt-tracker-interval': number;
    'bt-tracker-timeout': number;
    'check-integrity': boolean;
    'checksum': string;
    'conditional-get': boolean;
    'connect-timeout': number;
    'content-disposition-default-utf8': boolean;
    'continue': boolean;
    'dir': string;
    'dry-run': boolean;
    'enable-http-keep-alive': boolean;
    'enable-http-pipelining': boolean;
    'enable-mmap': boolean;
    'enable-peer-exchange': boolean;
    'file-allocation': 'none' | 'prealloc' | 'trunc' | 'falloc';
    'follow-metalink': boolean | 'mem';
    'follow-torrent': boolean | 'mem';
    'force-save': boolean;
    'ftp-passwd': string;
    'ftp-pasv': boolean;
    'ftp-proxy': string;
    'ftp-proxy-passwd': string;
    'ftp-proxy-user': string;
    'ftp-reuse-connection': boolean;
    'ftp-type': 'ascii' | 'binary';
    'ftp-user': string;
    'gid': ARIA2GID;
    'hash-check-only': boolean;
    'header': string;
    'http-accept-gzip': boolean;
    'http-auth-challenge': boolean;
    'http-no-cache': boolean;
    'http-passwd': string;
    'http-proxy': string;
    'http-proxy-passwd': string;
    'http-proxy-user': string;
    'http-user': string;
    'https-proxy': string;
    'https-proxy-passwd': string;
    'https-proxy-user': string;
    'index-out': string;
    'lowest-speed-limit': string;
    'max-concurrent-downloads': number;
    'max-connection-per-server': number;
    'max-download-limit': string;
    'max-file-not-found': number;
    'max-mmap-limit': number;
    'max-resume-failure-tries': number;
    'max-tries': number;
    'max-upload-limit': string;
    'metalink-base-uri': string;
    'metalink-enable-unique-protocol': boolean;
    'metalink-language': string;
    'metalink-location': string;
    'metalink-os': string;
    'metalink-preferred-protocol': 'none' | 'http' | 'https' | 'ftp';
    'metalink-version': string;
    'min-split-size': string;
    'no-file-allocation-limit': string;
    'no-netrc': boolean;
    'no-proxy': string;
    'out': string;
    'parameterized-uri': string;
    'pause': boolean;
    'pause-metadata': boolean;
    'piece-length': string;
    'proxy-method': 'get' | 'tunnel';
    'realtime-chunk-checksum': boolean;
    'referer': string;
    'remote-time': boolean;
    'remove-control-file': boolean;
    'retry-wait': number;
    'reuse-uri': boolean;
    'rpc-save-upload-metadata': boolean;
    'seed-ratio': number;
    'seed-time': number;
    'select-file': string;
    'split': number;
    'ssh-host-key-md': string;
    'stream-piece-selector': 'default' | 'inorder' | 'random' | 'geom';
    'timeout': number;
    'uri-selector': 'inoder' | 'feedback' | 'adaptive';
    'use-head': boolean;
    'user-agent': string;
};

export type ARIA2OptionsWithout<T extends keyof ARIA2Options> = {
    [key in Exclude<keyof ARIA2Options, T>]: ARIA2Options[key];
};
