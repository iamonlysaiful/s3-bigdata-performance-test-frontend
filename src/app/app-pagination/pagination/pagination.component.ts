import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

  constructor() { }
  //@Input() totalRecords: number = 0;
  //@Input() recordsPerPage: number = 0;
  @Input() selectedPageSize: number = 1;
  @Input() chartDateRange: any;
  @Input() pageCount: number = 1;
  @Output() onPageChange: EventEmitter<object> = new EventEmitter();
  @Output() onSelectionChange: EventEmitter<object> = new EventEmitter();

  public pages: number[] = [];
  activePage: number;
  sizes = [
    { value: '1', viewValue: '1 Day' },
  ];
  
  ngOnChanges() {
    this.pages = this.getArrayOfPage(this.pageCount);
    this.activePage = 1;
    this.onPageChange.emit({ activePage: 1, size: this.selectedPageSize });
    this.populateSize();
  }

  populateSize() {
    var a = moment(this.chartDateRange[0]);
    var b = moment(this.chartDateRange[1]);
    let diff = b.diff(a, 'days');
    this.sizes = [];
    if (diff >= 365) {
      this.sizes.push({ value: '365', viewValue: '1 Year' });
    }
    if (diff >= 30) {
      this.sizes.push({ value: '30', viewValue: '1 Month' });
    }
    if (diff >= 14) {
      this.sizes.push({ value: '14', viewValue: '2 Week' });
    }
    if (diff >= 7) {
      this.sizes.push({ value: '7', viewValue: '1 Week' });
    }
    if (diff >= 1) {
      this.sizes.push({ value: '1', viewValue: '1 Day' });
    }
  }

  selectionSizeChange(selectedSize) {
    this.selectedPageSize = selectedSize;
    this.onSelectionChange.emit({ activePage: 1, size: selectedSize });
    this.activePage = 1;
  }

  private getArrayOfPage(pageCount: number): number[] {
    let pageArray: number[] = [];

    if (pageCount > 0) {
      for (var i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }
    }

    return pageArray;
  }

  onClickPage(pageNumber: number) {
    if (pageNumber < 1) return;
    if (pageNumber > this.pages.length) return;
    this.activePage = pageNumber;
    this.onPageChange.emit({ activePage: this.activePage, size: this.selectedPageSize });
  }
}


