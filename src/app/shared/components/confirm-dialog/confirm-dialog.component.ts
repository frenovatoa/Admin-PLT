import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  message: string;
  name: string;
  btnName: string;
  btnName2:string;

  clicked = false;
  constructor(
    public dialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    this.name = data.name ? data.name : '';
    this.btnName = data.btnName;
    this.btnName2 = data.btnName2;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialog.close(2);
  }

  confirm() {
    this.clicked = true;
    this.dialog.close(1);
  }

}
