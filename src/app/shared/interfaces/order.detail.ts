export interface OrderDetail {
    id: string;
    orderId: string;
    productId: string;
    requestedQuantity: number;
    amount: number;
    isCourtesy: number;
 }