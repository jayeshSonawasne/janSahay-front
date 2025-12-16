import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogT1Component } from 'src/app/shared/components/confirmation-dialog-t1/confirmation-dialog-t1.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';


@Component({
  standalone: true,
  imports: [CommonModule, DirectivesModule, TableComponent],

  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.scss']
})
export class TempComponent {
  dataSource: any;
  sendToParantComp: any;
  tableDataobj!: any;
  pageNumber: number = 1;

  constructor(public translate: TranslateService, private apiService: ApiService, private dialog: MatDialog,
    private configService: ConfigService, private WebStorageService: WebStorageService) {
    this.tableBind();
  }

  //#region --------------------------------------------common table fn start-----------------------------------
  tableBind() {
    this.apiService.setHttp('GET', `/Course/GetCourseList?textSearch=&UserId=151&pageno=${this.pageNumber}&pagesize=` + this.configService.pageSize, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.dataSource = res.responseData;
        }
      },
      error: () => {
        this.sendTableData();
      },
      complete: () => {
        this.sendTableData();
      },
    });
  }

  sendTableData() {
    let displayedColumns: string[] = ['srno', 'courseName', 'courseMode', 'isPublish', 'action'];
    let displayedHeaders: string[] = ['Sr.No.', 'Course Name', 'Course Mode', 'Publish', 'Action'];

    let checkPagination = this.configService.pageSize < this.dataSource?.responseData2?.totalCount ? true : false;

    this.tableDataobj = {
      highlightedRow: null,
      tableOptions: [checkPagination, this.pageNumber, this.dataSource?.responseData2?.totalCount, this.configService.pageSize], // Pagination, Page Number, Pagination Count, Table Length,
      displayedColumns: displayedColumns,
      tableHeaders: displayedHeaders,
      tableData: this.dataSource?.responseData1,
      actions: [...this.WebStorageService.onCheckReadWriteDelete(true, true, true)], // View, Edit, Delete
      modifiedCol: [ // toggle, link, badge, date, dateWithTime, action 
        { key: 'courseMode', transformFor: 'toggle' },
        { key: 'courseName', transformFor: 'link', url: '../dashboard' }
      ],
      modifiedKeyData: () => { return this.tableDataobj?.modifiedCol.map((a: any) => a.key) },
    }
  }

  getTableData(obj: any) {
    switch (obj.label) {
      case 'pagination':
        this.pageNumber = obj.pageNumber;
        this.tableBind();
        break;
      case 'view':
        break;
      case 'edit':
        break;
      case 'Delete':
        this.onConfirmDialog();
        break;
      case 'toggle':
        break;
    }
  }
  //#endregion  --------------------------------------------common table fn end-----------------------------------//

  //#region --------------------------------------------common dialog box fn start------------------------------------//
  onConfirmDialog() {
    let dialoObj = {
      header: 'Delete',
      imgObj: { imgPath: 'assets/images/trash.gif', imgWidth: '', imgHeight: '100px' },
      titles: { main_title: 'Do you want to delete?', sub_title: '' },
      btns: { successButton: 'Delete', cancelButton: 'Cancel' }
    }

    const deleteDialogRef = this.dialog.open(ConfirmationDialogT1Component, {
      width: '300px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      console.log("result", result);
    })
  }


  //#endregion  ------------------------------------------common dialog box fn end-----------------------------------//


}
