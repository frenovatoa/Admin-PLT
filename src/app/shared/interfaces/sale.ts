import { Timestamp } from "firebase/firestore";
//Se importa la coleccion de otro servicio.
import { SaleDetail } from "./sale.detail";

export interface Sale {
    id: string;
    orderId: string;
    saleDate: Timestamp;
    saleTypeId: string;
    saleTypeDescription?: string;
    saleRetailPrice?: number;
    saleWholesalePrice?: number;
    userId: string;
    userName?: string;
    userLastName?: string;
    totalCost: number;
    status: boolean;
    saleDetails?: SaleDetail[]
 }