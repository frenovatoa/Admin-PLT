import { OrderDetail } from './order.detail';
import { Timestamp } from 'firebase/firestore';
import { Customer } from '../../pages/catalogs/clients/clients.component';
import { Address } from './address';
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
    status: number;
    orderDetails?:OrderDetail[],
    saleTypeDescription?:string
    customer?:Customer,
    address?:Address
 }