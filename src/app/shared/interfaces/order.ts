export interface Order {
    id: string;
    customerId: string;
    userId: string;
    addressId: string;
    saleTypeId: string;
    requestDate: number;
    deliveryDate: number;
    orderNotes: string;
    totalCost: number;
    status: number;
 }