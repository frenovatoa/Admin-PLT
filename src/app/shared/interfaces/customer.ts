import { Address } from './address';
export interface Customer{
    id: string;
    name: string;
    paternalLastName: string;
    maternalLastName: string;    
    phone: string;
    alternativePhone: string;
    status:number;
    address?:Address[]
}