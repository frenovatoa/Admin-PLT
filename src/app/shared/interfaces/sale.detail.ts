export interface SaleDetail {
    id: string;
    saleId: string;
    productId: string;
    productDescription?: string;
    productTypeDescription?: string;
    productRetailPrice?: number;
    productWholesalePrice?: number;
    requestedQuantity: number;
    price ?: number;
    amount: number;
    isCourtesy: number;
    status: boolean;
 }