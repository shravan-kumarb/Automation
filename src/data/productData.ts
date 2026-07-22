/**
 * Product / inventory test data: sort options and expected inventory facts.
 * Expected counts live in product.ts (derived from the catalog); this modile
 * centralizes the sort-dropdown option keys o specs never hardcode them.
 */

/** Sort keys accepted by ProductsPage.sortBy. */
export type SortKey = 'az' | 'za' | 'lohi' | 'hilo';

export const SortOptions: Record<string, SortKey> = {
  nameAToZ: 'az',
  nameZToA: 'za',
  priceLowToHigh: 'lohi',
  priceHighToLow: 'hilo',
};
