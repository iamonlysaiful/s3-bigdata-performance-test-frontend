import { Component } from '@angular/core';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-s3itest-main',
  templateUrl: './s3itest-main.component.html',
  styleUrls: ['./s3itest-main.component.scss']
})
export class S3itestMainComponent {

  title = 'S3 Internal Test';
  readingData: any;
  size = 1;
  page = 1;
  initPage = 1;
  searchData: any;

  constructor(private api: ApiServiceService) { }

  getReadingData(searchData, size, page) {
    let data = searchData;
    const startTime = moment(data.daterange[0]).format("DD-MM-YYYYhh-mm-ss-A");
    const endTime = moment(data.daterange[1]).format("DD-MM-YYYYhh-mm-ss-A");
    this.api.getReadingData(data.buildingId, data.objectId == 0 ? null : data.objectId, data.datafieldId == 0 ? null : data.datafieldId, startTime.toString(), endTime.toString(), page, size).subscribe((res) => {
      this.readingData = res.data.readingQuery.readings;
      // this.readingData = {
      //   chartData: res.data.readingQuery.readings,
      //   chartDateRange: data.daterange
      // };
    });
  }

  getReadingLazyData(searchData,startdate,enddate) {
    let data = searchData;
    const startTime = moment(startdate).format("DD-MM-YYYYhh-mm-ss-A");
    const endTime = moment(enddate).format("DD-MM-YYYYhh-mm-ss-A");
    this.api.getReadingLazyData(data.buildingId, data.objectId == 0 ? null : data.objectId, data.datafieldId == 0 ? null : data.datafieldId, startTime.toString(), endTime.toString()).subscribe((res) => {
      this.readingData = res.data.readingQuery.readingsLazyData;
    });
  }

  searchClick(event) {
    this.searchData = event;
    this.getReadingData(this.searchData, 1, 1);
  }

  onChartPageChange(event) {
    if (this.searchData !== undefined) {
      this.page = event.activePage;
      this.getReadingData(this.searchData, this.size, event.activePage);
    }
  }

  onChartPagesizeChangeRequest(event) {
    if (this.searchData !== undefined) {
      this.size = event.size;
      this.getReadingData(this.searchData, event.size, this.initPage);
    }
  }

  onLazyLoadRequest(event){
    debugger
    if (this.searchData !== undefined) {
      this.getReadingLazyData(this.searchData, event.startDate, event.endDate);
    }
  }
}
