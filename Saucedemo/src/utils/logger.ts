type level = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

function log(level: level, message:string, meta?: unknown): void {
    const stamp = new Date().toISOString();
    const line =
    meta !== undefined
    ? `${stamp} [${level}] ${message} ${JSON.stringify(meta)}`
    : `${stamp} [${level}] ${message}`;
    if(level === 'ERROR'){
        console.error(line);
    }
    else if (level === 'WARN'){
        console.warn(line);
    }
    else if (level === 'DEBUG'){
        if(process.env.DEBUG) console.debug(line);
    }
    else {
        console.log(line);
    }
}

export const logger ={
    info: (msg: string, meta?: unknown): void => log('INFO', msg, meta),
    warn: (msg: string, meta?:unknown): void => log('WARN', msg, meta),
    error: (msg: string, meta?:unknown): void => log('ERROR', msg, meta),
    debug: (msg: string, meta?:unknown): void => log('DEBUG',msg, meta),

}