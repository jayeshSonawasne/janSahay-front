import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-confirmation-dialog-t1',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatFormFieldModule],
  templateUrl: './confirmation-dialog-t1.component.html',
  styleUrls: ['./confirmation-dialog-t1.component.scss']
})
export class ConfirmationDialogT1Component {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogT1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any) {  }

  closeDialog(result: string) {
    this.dialogRef.close(result);
  }
}
