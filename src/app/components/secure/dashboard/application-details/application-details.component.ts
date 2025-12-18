import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-application-details',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './application-details.component.html',
    styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent {
    constructor(
        public dialogRef: MatDialogRef<ApplicationDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    close(): void {
        this.dialogRef.close();
    }

    getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
            'active': 'status-active',
            'pending': 'status-pending',
            'completed': 'status-completed',
            'approved': 'status-approved',
            'rejected': 'status-rejected',
            'in review': 'status-pending',
            'correction needed': 'status-pending'
        };
        return statusClasses[status.toLowerCase()] || '';
    }
}
