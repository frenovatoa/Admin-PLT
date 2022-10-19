import { Component } from '@angular/core';
import { TestService } from 'src/app/shared/services/test/test.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component {

    public data: any;
    constructor(public fb:TestService) { }

    ngOnInit(): void {
        // Obtener los documentos de la colección indicada en la función getData()
        //this.data=this.fb.getData().subscribe((data)=>{
           // console.log(data)
           // this.data=data
       // });
        // Insertar un documento en la colección indicada en la función addData(data)
        //this.fb.addData({descripcion: 'Auxiliar', estatus: '1'}).then((data)=>{
        //    console.log(data)
       // });
        // Actualizar un documento en específico de la colección indicada en la función updateData(id, data)
       // this.fb.updateData('z50EJXiQIk3yNKVcITH0', {descripcion: 'Auxiliar', estatus: '1'});
       // this.fb.updateData('vzoyLcJvQb4Kv66Trcoa', {descripcion: 'Administrador', estatus: '1'});
    }
}
