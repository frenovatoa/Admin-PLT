import { OrderDetail } from './order.detail';
import { Timestamp } from 'firebase/firestore';
import { Customer } from '../../pages/catalogs/clients/clients.component';
import { Address } from './address';
import { SaleDetail } from './sale.detail';

export interface Order {
    id: string;
    customerId: string;
    userId: string;
    addressId: string;
    saleTypeId: string;
    requestDate: number;
    deliveryDate: Timestamp;
    orderNotes: string;
    totalCost: number;
    status: string;
    orderDetails?:OrderDetail[],
    orderTypeDescription?:string,
    customer?:Customer,
    address?:Address,
    deliveryCost:number,
    quantity?:number
 }

 export interface Sale {
    id: string;
    orderId: string;
    saleDate: number;
    saleTypeId: string;
    saleTypeDescription?: string;
    saleRetailPrice?: number;
    saleWholesalePrice?: number;
    userId: string;
    userName?: string;
    userLastName?: string;
    totalCost: number;
    status: string;
    saleDetails?: SaleDetail[]
 }