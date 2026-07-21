import type { CheckOutInfo } from '@pages/CheckOutPage';
import { randomFirstName, randomLastName, randomPostalCode } from '@utils/dataGenerator';

/** A checkout validation scenario (invalid customer info -> expected error). */
export interface CheckoutValidationCase extends CheckOutInfo {
  message: RegExp;
}

/** Valid customer used by the happy-path checkout flow. */
export const validCustomer: CheckOutInfo = {
  firstName: 'Sam',
  lastName: 'Brown',
  postalCode: '242544',
};

/**Invalid checkout-info scenarios driving the data-driven validation tests. */
export const checkoutValidationCases: CheckoutValidationCase[] = [
  { firstName: '', lastName: 'Iyer', postalCode: '454425', message: /First Name is required/i },
  { firstName: 'Venice', lastName: '', postalCode: '252533', message: /Last Name is required/i },
  { firstName: 'Venice', lastName: 'Iyer', postalCode: '', message: /Postal Code is required/i },
];

/** Generate a unique, valid customer for dynamic-data scenarios. */
export function generateCustomer(overrides: Partial<CheckOutInfo> = {}): CheckOutInfo {
  return {
    firstName: randomFirstName(),
    lastName: randomLastName(),
    postalCode: randomPostalCode(),
    ...overrides,
  };
}
