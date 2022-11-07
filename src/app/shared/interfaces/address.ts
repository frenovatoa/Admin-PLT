export interface Address {
    id?: string;
    customerId?: string;
    postCode?: string;
    street: string;
    insideNumber?:string;
    outsideNumber?: string;
    neighborhood?: string;
    city?: string;
    status?: boolean;
 }
