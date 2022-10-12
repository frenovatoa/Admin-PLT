export interface User {
   uid?: string;
   userTypeId?: string;
   name: string;
   paternalLastName?: string;
   maternalLastName?: string; 
   email: string;
   password: string;
   status?: number;
   image?: string;
}