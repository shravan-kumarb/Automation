import { ProductName, ProductNames } from './products';

/**\
 * Reusable cart item sets shared across cart, product, and checkout specs.
 * Defined once here so the same scenarios are referenced everywhere instead of
 * being re-typed as literal arrays inside individual tests.
 */

/** Default two-item set used by cart and product add/remove scenarios. */
export const defaultCartItems: ProductName[] = [ProductNames.backpack, ProductNames.bikeLight];

/** Item set used by the end-to-end checkout scenario. */
export const checkoutCartItems: ProductName[] = [
  ProductNames.boltTshirt,
  ProductNames.testAllThings,
];
