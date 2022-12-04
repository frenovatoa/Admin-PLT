import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    OnInit,
    ViewChild
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
    MatDialog,
    MatDialogRef,
    MatDialogConfig,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
// import { Subject } from 'rxjs/Subject';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView
} from 'angular-calendar';
import { ConditionalExpr, NullTemplateVisitor } from '@angular/compiler';
const colors: any = {
    red: {
        primary: '#fc4b6c',
        secondary: '#f9e7eb'
    },
    blue: {
        primary: '#1e88e5',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#ffb22b',
        secondary: '#FDF1BA'
    }
};
import { DateAdapter } from "angular-calendar";
import { ScheduleService } from 'src/app/shared/services/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/app/shared/interfaces/order';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Schedule } from 'src/app/shared/interfaces/schedule';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { User } from 'src/app/shared/interfaces/user';

registerLocaleData(localeEs);

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {
    locale: string = "es";
    public orders: Order[];
    public schedule: Schedule[];
    public dataSource: MatTableDataSource<Order>;

    // dialogRef: MatDialogRef<CalendarDialogComponent> = Object.create(NullTemplateVisitor);
    //   dialogRef2: MatDialogRef<CalendarFormDialogComponent> = Object.create(NullTemplateVisitor);

    lastCloseResult = '';
    actionsAlignment = '';
    /*
        config: MatDialogConfig = {
            disableClose: false,
            width: '',
            height: '',
            position: {
                top: '',
                bottom: '',
                left: '',
                right: ''
            },
            data: {
                action: '',
                event: []
            }
        };
        */
    numTemplateOpens = 0;

    view = 'month';
    viewDate: Date = new Date();

    public events: CalendarEvent[] = [];

    actions: CalendarEventAction[] = [
        {
            label: '<i class="ti-pencil act"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edit', event);
            }
        },
        {
            label: '<i class="ti-close act"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    // refresh: Subject<any> = new Subject();

    // events: CalendarEvent[] = [
    //     {
    //         start: subDays(startOfDay(new Date()), 1),
    //         end: addDays(new Date(), 1),
    //         title: 'A 3 day event',
    //         color: colors.red,
    //         actions: this.actions
    //     },
    //     {
    //         start: startOfDay(new Date()),
    //         title: 'An event with no end date',
    //         color: colors.yellow,
    //         actions: this.actions
    //     },
    //     {
    //         start: subDays(endOfMonth(new Date()), 3),
    //         end: addDays(endOfMonth(new Date()), 3),
    //         title: 'A long event that spans 2 months',
    //         color: colors.blue
    //     },
    //     {
    //         start: addHours(startOfDay(new Date()), 2),
    //         end: new Date(),
    //         title: 'A draggable and resizable event',
    //         color: colors.yellow,
    //         actions: this.actions,
    //         resizable: {
    //             beforeStart: true,
    //             afterEnd: true
    //         },
    //         draggable: true
    //     }
    // ];

    // dates = [{
    //     start: subDays(endOfMonth(new Date()), 3),
    //     end: addDays(endOfMonth(new Date()), 3),
    //     title: 'A long event that spans 2 months',
    //     color: colors.blue
    // },
    // {
    //     start: addHours(startOfDay(new Date()), 2),
    //     end: new Date(),
    //     title: 'A draggable and resizable event',
    //     color: colors.yellow,
    //     actions: this.actions,
    //     resizable: {
    //         beforeStart: true,
    //         afterEnd: true
    //     },
    //     draggable: true
    // }];

    public dates: any[] = [];
    public userLogged:User;
    
/*Cambio test*/
    activeDayIsOpen = true;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public dialog: MatDialog, @Inject(DOCUMENT) doc: any, public fb: ScheduleService,
    public fa: UserService,
    private router: Router,
    public authService:AuthService) {
        this.userLogged = this.authService.user;
     }

    ngOnInit(): void {
        this.fa.getUser().subscribe((user: any)=>{
            user.forEach(user => {
                if(user.email == this.userLogged.email){
                  if(user.userTypeId=='oqHSeK8FRTbWtObf7FdD'){
                    this.router.navigate(['/dashboard'])
                  }
                    this.userLogged = user;
                  
                }
            });
        });  
      
        // this.fb.getOrders().subscribe(async (order: any) => {
        //     this.dates = order
        //     console.log(order);
        //     // console.log(order.deliveryDate)
        //     //this.dates = order
        //     // console.log(this.dataSource);

        //    // console.log(this.orders);
           
        //     // let orderDate
        //     // this.orders.forEach((orders, index) => {
        //     //     this.orders[index].deliveryDate = orderDate
        //     // })
        //     await order.forEach(async (order, index) => {
        //         await this.fb.getCustumer(order.customerId).subscribe(async (customer: any) => {
        //             this.dates[index].customer = customer;
        //             await this.fb.getAddress(order.customerId, order.addressId).subscribe((address: any) => {
        //                 this.dates[index].address = address;
        //             });
        //         });
        //     })
        //     this.dates.forEach((orders, index) => {
        //         this.dates[index].customerName = orders.customer.name;
        //         this.dates[index].title = orders.orderNotes;
        //         // Para quién, costo toal, notas, fecha
        //         this.dates[index].start = orders.deliveryDate.toDate();
        //         this.dates[index].color = colors.blue;
        //         // this.dates.push(orders)
        //     });
        //     console.log(this.dates);
            
        //     this.events = this.dates;
        // });

        // Obtener los documentos de la colección indicada en la función getUser()
        this.fb.getOrders().subscribe((order: any) => {
            console.log(order);
            // console.log(order.deliveryDate)
            this.dates = order
            // console.log(this.dataSource);

            console.log(this.orders);
            order.forEach((orders, index) => {
                this.dates[index].customerName = orders.customerId;
                this.dates[index].title = orders.orderNotes;
                // Para quién, costo toal, notas, fecha
                this.dates[index].start = orders.deliveryDate.toDate();
                this.dates[index].color = colors.blue;
                // this.dates.push(orders)
            });
            console.log(this.dates);
            
            this.events = this.dates;
            // let orderDate
            // this.orders.forEach((orders, index) => {
            //     this.orders[index].deliveryDate = orderDate
            // })
        });
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });

        this.handleEvent('Dropped or resized', event);

    }

    handleEvent(action: string, event: CalendarEvent): void {
        /* debugger;
         this.config.data = { event, action };
         this.dialogRef = this.dialog.open(CalendarDialogComponent, this.config);
 
         this.dialogRef.afterClosed().subscribe((result: string) => {
             this.lastCloseResult = result;
             this.dialogRef = Object.create(null);
             this.refresh.next();
         });*/
    }

    addEvent(): void {
        /* this.dialogRef2 = this.dialog.open(CalendarFormDialogComponent, {
             panelClass: 'calendar-form-dialog',
             data: {
                 action: 'add',
                 date: new Date(),
             },
         });
         this.dialogRef2.afterClosed().subscribe((res) => {
             if (!res) {
                 return;
             }
             const dialogAction = res.action;
             const responseEvent = res.event;
             responseEvent.actions = this.actions;
             this.events.push(responseEvent);
             this.dialogRef2 = Object.create(null);
             this.refresh.next();
 
         });*/
    }

    deleteEvent(eventToDelete: CalendarEvent): void {
        this.events = this.events.filter((event) => event !== eventToDelete);
    }

    setView(view: CalendarView): void {
        this.view = view;
    }
}
