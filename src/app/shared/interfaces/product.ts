
export interface Product {
    id: string;
    productTypeId: string;
    productTypeDescription?: string;
    productRetail?: number;
    productWholesale?: number;
    description: string;
    quantity: number;
    image: string;
    status: number;
 }