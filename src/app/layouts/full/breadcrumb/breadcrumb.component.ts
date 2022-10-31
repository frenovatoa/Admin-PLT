import {
  Component,
  OnInit,
  Pipe
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: []
})

export class AppBreadcrumbComponent {
  // @Input() layout;
  pageInfo: Data = Object.create(null);

  // Declaramos variables vacías para los títulos
  public title: string = "";
  public route: string = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private titleService: Title
  ) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .pipe(map(() => this.activatedRoute))
        .pipe(
          map(route => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          })
        )
        .pipe(filter(route => route.outlet === 'primary'))
        .pipe(mergeMap(route => route.data))
        // tslint:disable-next-line - Disables all
        .subscribe(event => {
          // tslint:disable-next-line - Disables all
          this.titleService.setTitle(event['title']);
          this.pageInfo = event;
        });
  
        this.route = this.router.url ;
        this.asigneTitle();
        console.log (this.route);

      }

      // Poner los títulos de los encabezados en cada página
      asigneTitle() {
        console.log(this.route)
        // Debo poner un caso para cada página
        switch(this.route){
          // En case se pone la ruta url que aparece en la página
          case '/pages/admin/users': {
            // Asignamos un título para la página correspondiente
            this.title = 'Usuarios';
            break;
          }
          case '/pages/catalogs/clients': {
            this.title = 'Clientes';
            break;
          }
          case '/pages/catalogs/products': {
            this.title = 'Productos';
            break;
          }
          case '/pages/catalogs/typeOfProducts': {
            this.title = 'Tipos de producto';
            break;
          }
          case '/pages/sales/sales': {
            this.title = 'Punto de venta';
            break;
          }
          case '/pages/orders/generateOrder': {
            this.title = 'Pedidos';
            break;
          }
          case '/pages/orders/schedule': {
            this.title = 'Agenda de pedidos';
            break;
          }
          case '/pages/production/production': {
            this.title = 'Producción';
            break;
          }
          default: {            
            break;
          }
        }
      }
}
