import {config} from '@dotenvx/dotenvx';
config({quiet:true});

export interface User {
  username: string;
  password: string;
  type: 'valid' | 'locked' | 'problem' | 'performance';
}

/**
 * All usernames + the shared password are sourced exclusively from the 
 * environment (.env / CI secret) - no credential values live in this file.
 * See .env.example for the variables that must be set.
 */
function requireEnv(name: string):string{
  const value = process.env[name];
  if(!value){
    throw new Error(`Missing required environment variables: ${name} (see .env.example)`);
  }
  return value;
}
const sharedPassword = requireEnv('SAUCE_PASSWORD');
const standardUsername = requireEnv('SAUCE_USERNAME');
const lockedUsername = requireEnv('SAUCE_LOCKED_USERNAME');
const problemUsername = requireEnv('SAUCE_PROBLEM_USERNAME');
const performanceUsername = requireEnv('SAUCE_PERFORMANCE_USERNAME');


export const Users: Record<string, User> = {
  standard: {
    username: standardUsername,
    password: sharedPassword,
    type: 'valid',
  },
  locked: {
    username: lockedUsername,
    password: sharedPassword,
    type: 'locked',
  },
  problem: {
    username: problemUsername,
    password: sharedPassword,
    type: 'problem',
  },
  performance: {
    username: performanceUsername,
    password: sharedPassword,
    type: 'performance',
  },
};
