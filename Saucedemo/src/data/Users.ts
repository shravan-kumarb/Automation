import 'dotenv/config';

export interface User{
    username: string;
    password: string;
    type : 'valid'|'locked'|'problem'|'performance';
}

/**
 * shared password is sourced from the environment (.env / CI secret) so it is
 * neverf hardcoded. Falls back to SauceDemo's public demo password for convenience.
 */
const sharedPassword = process.env.SAUCE_PASSWORD || 'secret_sauce';
const standardUsername = process.env.SAUCE_USERNAME || 'standard_user';

export const Users: Record<string, User> = {
            Standard:{
                username:'standard_user',
                password:'secret_sauce',
                type:'valid',
            },
            locked:{
                username:'locked_out_user',
                password:'secret_sauce',
                type:'locked',
            },
            problem:{
                username:'problem_user',
                password:'secret_sauce',
                type:'problem',
            },
            performance:{
                username:'performance_glitch_user',
                password:'secret_sauce',
                type:'performance',
            },
};
