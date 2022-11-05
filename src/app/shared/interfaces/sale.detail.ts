export interface SaleDetail {
    id: string;
    saleId: string;
    productId: string;
    productDescription?: string;
    productRetailPrice?: number;
    productWholesalePrice?: number;
    requestedQuantity: number;
    amount: number;
    isCourtesy: number;
    status: boolean;
 }