import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-scheme-details',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatTabsModule, MatIconModule],
    templateUrl: './scheme-details.component.html',
    styleUrls: ['./scheme-details.component.scss']
})
export class SchemeDetailsComponent {
    constructor(
        public dialogRef: MatDialogRef<SchemeDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    close(): void {
        this.dialogRef.close();
    }

    apply(): void {
        this.dialogRef.close('apply');
    }
}
