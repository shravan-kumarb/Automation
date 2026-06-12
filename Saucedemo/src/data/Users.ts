import 'dotenv/config';

export interface User {
  username: string;
  password: string;
  type: 'valid' | 'locked' | 'problem' | 'performance';
}

/**
 * shared password is sourced from the environment (.env / CI secret) so it is
 * neverf hardcoded. Falls back to SauceDemo's public demo password for convenience.
 */
const sharedPassword = process.env.SAUCE_PASSWORD || 'secret_sauce';
const standardUsername = process.env.SAUCE_USERNAME || 'standard_user';

export const Users: Record<string, User> = {
  standard: {
    username: standardUsername,
    password: sharedPassword,
    type: 'valid',
  },
  locked: {
    username: 'locked_out_user',
    password: sharedPassword,
    type: 'locked',
  },
  problem: {
    username: 'problem_user',
    password: sharedPassword,
    type: 'problem',
  },
  performance: {
    username: 'performance_glitch_user',
    password: sharedPassword,
    type: 'performance',
  },
};
