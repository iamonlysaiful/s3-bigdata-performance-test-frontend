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
  spinnerData: string = '';

  constructor(private api: ApiServiceService) {}
  //==========================reading api call============
  getReadingData(searchData) {
    this.spinnerData = 'spinner-border';
    let data = searchData;
    const startTime = moment(data.daterange[0]).format("DD-MM-YYYYhh-mm-ss-A");
    const endTime = moment(data.daterange[1]).format("DD-MM-YYYYhh-mm-ss-A");
    this.api.getReadingData(data.buildingId, data.objectId, data.datafieldId, startTime.toString(), endTime.toString()).subscribe((res) => {
      this.readingData = res.data.readingQuery.readings;
      this.spinnerData = '';
    });
  }
  searchClick(event) {
    this.getReadingData(event);
  }
}
