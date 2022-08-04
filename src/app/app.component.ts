import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SIPGIS';
    constructor(private _dialog: MatDialog) { }
  openPopup() {
    const dialogRef = this._dialog.open(AppComponent, {
      ariaDescribedBy: 'sectorDialogBox',
      width: '450px'
    });
  }
}
