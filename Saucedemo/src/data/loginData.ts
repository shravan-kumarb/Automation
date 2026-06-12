import { Users } from './Users';

/** A negative/invalid login scenario driving the data-driven login tests. */
export interface InvalidLoginCase {
  name: string;
  username: string;
  password: string;
  message: RegExp;
}

/**
 * Invalid login scenarios. Known-good values are sourced from `Users` so the
 * standard username/password are never re-hardcoded here.
 */
export const invalidLoginCases: InvalidLoginCase[] = [
  {
    name: 'wrong password',
    username: Users.standard.username,
    password: 'wrong',
    message: /do not match/i,
  },
  {
    name: 'unknown user',
    username: 'no_user',
    password: 'secret',
    message: /do not match/i,
  },
  {
    name: 'empty username',
    username: '',
    password: Users.standard.password,
    message: /Username is required/i,
  },
  {
    name: 'empty password',
    username: Users.standard.username,
    password: '',
    message: /Password is required/i,
  },
];
