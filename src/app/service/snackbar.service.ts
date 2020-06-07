import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    public _snackBar: MatSnackBar,
    private zone: NgZone) { }
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public open(message, action = 'OK', duration = 4000) {
    this.zone.run(() => {
      this._snackBar.open(message, action, {
        duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    })
  }
}
