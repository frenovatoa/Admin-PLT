import { Timestamp } from "firebase/firestore";

export interface Sale {
    id: string;
    orderId: string;
    userId: string;
    userName?: string;
    userLastName?: string;
    saleTypeId: string;
    saleTypeDescription?: string;
    saleDate: Timestamp;
    totalCost: number;
    status: number;
 }