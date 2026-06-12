import productData from './products.json';

export interface Product {
    name: String;
    price: number;
}

export const products:Product[]=productData;

/**
 * Centeralized, typed product-name constants. Test reference these instead of 
 * repeating string literals, so a catalog rename is a one-line change here.
 */

export const ProductNames ={
    backpack:'Sauce Labs Backpack',
    bikeLight:'Sauce Labs Bike Light',
    boltTshirt:'Sauce Labs Bolt T-Shirt',
    fleeceJacket:'Sauce Labs Fleece Jacket',
    onesie:'Sauce Labs Onesie',
    testAllThings:'Test.allTheThings() T-Shirt (Red)',
}as const;

export type ProductName = (typeof ProductNames)[keyof typeof ProductNames];
/** Expected number of products in teh inventory, derived from the catalog. */

export const expectedProductCount: number = products.length;


export function getProductPrice(name:string): number{
    const match = products.find(p=>p.name===name);
    if(!match) throw new Error(`Unknown product: ${name}`);
    return match.price;
}

// Fail fast at module load if a ProductNames constant drifts from the catalog.
for(const name of Object.values(ProductNames)){
    getProductPrice(name);
}

