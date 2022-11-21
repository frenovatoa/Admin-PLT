import { EventColor } from 'calendar-utils';
import { Timestamp } from 'firebase/firestore';
export interface Schedule {
    id: string;
    start: Date;
    title: string;
    color: EventColor;
    customerName: string;
 }