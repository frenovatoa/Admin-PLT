import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { AuthService } from '../../../shared/auth/auth.service';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: []
})

export class VerticalAppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  public user: User;
public activate:boolean = false;
  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>()


  private _mobileQueryListener: () => void;
  status = true;
  showMenu = '';
  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  
  subclickEvent(): void {
    this.status = true;
  }
  scrollToTop(): void {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0
    });
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    public authService:AuthService,
    public fb: UserService

  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.user = this.authService.user;
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.fb.getUser().subscribe((user: any)=>{
      user.forEach(user => {
        if(user.email == this.user.email){

          this.user = user;
          console.log(this.user)
          this.user.name = user.name;
          this.user.maternalLastName = user.maternalLastName;
          this.user.paternalLastName = user.paternalLastName;
          this.activate=true;
        }
        
      });
      console.log(this.user)
  });  
   
    //this.user = this.authService.user;
    //console.log(this.authService.user)
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  handleNotify() {
    if(window.innerWidth < 1024){
      this.notify.emit(!this.showClass);
    }
  }
  logOut(){
    this.authService.SignOut();
  }
}
