import {logger} from './logger';

/**
 * Wrap an error in this to signal that it must NOT be retried
 * (e.g. deterministic HTTP 4xx client errors).
 */

export class NonRetryableError extends Error{
    constructor(message: string){
        super(message);
        this.name = 'NonRetryabaleError';
    }
}

export interface RetryOptions {
    retries?: number;
    delayMs?: number;
    factor?:number;
    label?: string;
    /**
     * Predicate deciding whether a given error is worth retrying.
     * Defaults to retrying everything expect NonRetryableError.
     */
    shouldRetry?: (error: unknown)=>boolean;
}

function defaultShouldRetry(error:unknown):boolean{
    return !(error instanceof NonRetryableError);
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}):Promise<T>{
    const{
        retries =2,
        delayMs = 500,
        factor=2,
        label='operation',
        shouldRetry = defaultShouldRetry,
    } = options;
    let lastError :unknown;

    for(let attempt=0;attempt<=retries;attempt++){
        try{
            return await fn();
        }catch (error){
            lastError = error;
            const isLastAttempt = attempt === retries;
            if(isLastAttempt || !shouldRetry(error)) break;
            const wait = delayMs * Math.pow(factor, attempt);
            logger.warn(
                `${label} failed (attempt ${attempt + 1}/${retries+1}), retrying in ${wait}ms`,
                {
                    error: error instanceof Error ? error.message :String(error),
                },
            );
            await new Promise((resolve) => setTimeout(resolve, wait));
        }
    }


logger.error(`${label} failed`);
throw lastError;
}
