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
  spinner: string = 'end';
  size = 1;
  page = 1;
  initPage = 1;
  searchData: any;

  constructor(private api: ApiServiceService) { }

  //==========================reading api call============
  async getReadingData(searchData, size, page) {
    this.spinner = 'start';
    let data = searchData;
    const startTime = moment(data.daterange[0]).format("DD-MM-YYYYhh-mm-ss-A");
    const endTime = moment(data.daterange[1]).format("DD-MM-YYYYhh-mm-ss-A");
    this.api.getReadingData(data.buildingId, data.objectId == 0 ? null : data.objectId, data.datafieldId == 0 ? null : data.datafieldId, startTime.toString(), endTime.toString(), page, size).subscribe((res) => {
      this.readingData = {
        chartData: res.data.readingQuery.readings,
        chartDateRange: data.daterange
      };
      this.spinner = 'end';
    });
    return await this.spinner;
  }

  searchClick(event) {
    this.searchData = event;
    this.getReadingData(this.searchData, this.size, this.page);
  }

  async onChartPageChange(event) {
    if (this.searchData !== undefined) {
      this.page = event.activePage;
      let x = await this.getReadingData(this.searchData, this.size, event.activePage);
      if (x == 'start') {
        this.spinner = 'end'
      }
    }
  }

  async onChartPagesizeChangeRequest(event) {
    if (this.searchData !== undefined) {
      this.size = event.size;
      let x = await this.getReadingData(this.searchData, event.size, this.initPage);
      if (x == 'start') {
        this.spinner = 'end'
      }
    }
  }
}
