import { Timestamp } from "firebase/firestore";
//Se importa la coleccion de otro servicio.
import { ProductionDetail } from "./production.detail";

export interface Production {
    id: string;
    userId: string;
    userName?: string;
    userLastName?: string;
    productionDate: Timestamp;
    productionNotes: string;
    productionDetails?: ProductionDetail[]
 }