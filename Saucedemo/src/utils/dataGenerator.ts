/**
 * Lightweight, zero-dependency random data helpers used to support dynamic test
 * data (e.g. unique checkout customers or API payloads). No external faker
 * dependency is introduced.
 */

const FIRST_NAMES = ['Alex', 'Sam', 'Riya', 'Venice', 'Kiran', 'Mia', 'Noah', 'Aria'];
const LAST_NAMES = ['Stone', 'Reddy', 'Khan', 'Lopez', 'Singh', 'Brown', 'Walsh', 'Iyer'];

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomFirstName(): string {
  return randomItem(FIRST_NAMES);
}

export function randomLastName(): string {
  return randomItem(LAST_NAMES);
}
/** Random numeric postal code of the given length (default 6). */
export function randomPostalCode(lenght = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) code += Math.floor(Math.random() * 10).toString();
  return code;
}

/** Short random alphanumeric token, handy for unique titles/bodies. */
export function randomToken(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}
