import { Component, OnInit } from '@angular/core';
//import * as Highcharts from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/boost')(Highcharts);
import * as moment from 'moment';
import { ApiServiceService } from './service/api-service.service';
//declare var $: any;
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'underscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'S3 Internal Test';
  buildingList = [];
  objectList = [];
  dfList = [];
  readingSeries = [{
    name: '', data: [],
    turboThreshold: 1,
    color: '#1c4c74',
    // {
    //   linearGradient: [0, 0, 0, 140],
    //   stops: [
    //     [0, 'rgb(28, 76, 116)'],
    //     [1, 'rgb(97, 172, 228)']
    //   ]
    // },
    lineWidth: 1,
    dataGrouping: {
      enabled: false
    }
  }];
  chartOptions: any;
  maxDistance = 24 * 3600 * 1000;
  spinnerClass: any;
  highcharts = Highcharts;

  searchForm: FormGroup;
  constructor(private api: ApiServiceService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      buildingId: ['', Validators.required],
      objectId: ['', Validators.required],
      datafieldId: ['', Validators.required],
      daterange: [[new Date(2018, 4, 10, 0, 0), new Date(2018, 4, 12, 23, 59)], Validators.required]
    });
  }

  ngOnInit(): void {
    this.getBuildingsDD();
    this.getObjectsDD();
    this.getDataFieldsDD();
    this.generateReadingChart(this.readingSeries);
  }

  //======================DD Section===========

  getBuildingsDD() {
    this.api.getBuildingsForDD().subscribe((res) => {
      this.buildingList = res.data.bQuery.buildings;
    });
  }
  getObjectsDD() {
    this.api.getObjectsForDD().subscribe((res) => {
      this.objectList = res.data.objQuery.objects;
    });
  }
  getDataFieldsDD() {
    this.api.getDataFieldsForDD().subscribe((res) => {
      this.dfList = res.data.dfieldQuery.datafields;
    });
  }
  //==========================reading api call============
  getReadingData() {
    this.spinnerClass = 'spinner-border';
    let data = this.searchForm.value;
    const startTime = moment(data.daterange[0]).format("DD-MM-YYYYhh-mm-ss-A");
    const endTime = moment(data.daterange[1]).format("DD-MM-YYYYhh-mm-ss-A");
    this.api.getReadingData(data.buildingId, data.objectId, data.datafieldId, startTime.toString(), endTime.toString()).subscribe((res) => {
      let readingData = res.data.readingQuery.readings;
      this.readingSeries = [];
      this.readingSeries.push({
        name: readingData.objectName + ' ' + readingData.dataFieldName,
        data: _.zip(readingData.timestamp, readingData.value),
        //type: "line",
        turboThreshold: Infinity,
        color: '#1c4c74',
        // {
        //   linearGradient: [0, 0, 0, 140],
        //   stops: [
        //     [0, 'rgb(28, 76, 116)'],
        //     [1, 'rgb(97, 172, 228)']
        //   ]
        // },
        lineWidth: 1,
        dataGrouping: {
          enabled: false
        }
      });
      this.generateReadingChart(this.readingSeries);

    });
  }

  generateReadingChart(series) {
    this.chartOptions = {
      chart: {
        type: "line",
        zoomType: 'x',
        animation: {
          duration: 1000
        }
      },
      boost: {
        seriesThreshold: Infinity,
        useGPUTranslations: false,
        useAlpha: false,
        usePreallocated: false,
        timeRendering: true,
        timeSeriesProcessing: true,
        timeSetup: true
      },

      navigator: {
        enabled: true,
        adaptToUpdatedData: true,
        series: {
          data: series.data,
          // dataGrouping: {
          //   enabled: false
          // }
        }
      },
      rangeSelector: {
        enabled: true,
        // allButtonsEnabled: true,
        buttons: [{
          type: 'hour',
          count: 1,
          text: '1h'
        },
        {
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
          type: 'week',
          count: 1,
          text: '1w'
        },
        {
          type: 'week',
          count: 2,
          text: '2w'
        },
        {
          type: 'month',
          count: 1,
          text: '1m'
        },
        {
          type: 'year',
          count: 1,
          text: '1y'
        },
        {
          type: 'all',
          text: 'all'
        }],
        inputEnabled: false,
        selected: 7 // all
      },
      title: {
        text: ""//"Sensor Reading Timeseries Data Overview"
      },
      useHighStocks: true,
      xAxis: {
        title: {
          text: "Time",
        },
        labels: {
          rotation: 0,
          formatter: function () {
            if (this.isFirst || this.isLast) {
              return Highcharts.dateFormat('%Y-%b-%e', this.value);
            } else {
              return Highcharts.dateFormat('%l:%M %p', this.value);
            }
          }
        },
        //minRange: 1,
        // scrollbar: {
        //   liveRedraw: false
        // },
        events: {
          afterSetExtremes: function (e) {
            var chart = Highcharts.charts[0];

            chart.showLoading('Loading data from server...');
            //     //debugger
            //     if (this.maxDistance !== undefined && e.rangeSelectorButton !== undefined) {
            //       if (e.rangeSelectorButton.text == '1h') {
            //         this.maxDistance = 1 * 3600 * 1000; //1hour
            //       }
            //       else if (e.rangeSelectorButton.text == "1d") {
            //         this.maxDistance = 24 * 3600 * 1000;
            //       }
            //       else if (e.rangeSelectorButton.text == "1w") {
            //         this.maxDistance = 7 * 24 * 3600 * 1000;
            //       }
            //       else if (e.rangeSelectorButton.text == "2w") {
            //         this.maxDistance = 14 * 24 * 3600 * 1000;
            //       }
            //       else if (e.rangeSelectorButton.text == "1m") {
            //         this.maxDistance = 30 * 24 * 3600 * 1000;
            //       }
            //       else if (e.rangeSelectorButton.text == "1y") {
            //         this.maxDistance = 365 * 24 * 3600 * 1000;
            //       }
            //       else {
            //         this.maxDistance = (e.max - e.min) * 24 * 3600 * 1000;
            //       }
            //     } else {
            //       this.maxDistance = this.maxDistance === undefined ? 24 * 3600 * 1000 : this.maxDistance; //1hour
            //     }

            //     var xaxis = this;
            //     if ((e.max - e.min) > this.maxDistance) {
            //       var min = e.min;// + this.maxDistance;
            //       var max = e.min + this.maxDistance;// * 2;
            //       window.setTimeout(function () {
            //         xaxis.setExtremes(min, max);
            //       }, 1);
            //     }
            chart.hideLoading();
          }
        },
      },
      yAxis: {
        title: {
          text: "Value"
        }
      },
      tooltip: {
        formatter: function () {
          //console.log(this.point,this.xAxis);
          return '<b>' + this.series.name + '</b><br/>' +
            'Date: ' + Highcharts.dateFormat('%e-%b-%Y %l:%M %p', this.point.category)
            + ', Value: ' + this.y;
        }
      },
      lang: {
        noData: "No data to display"
      },
      noData: {
        style: {
          fontWeight: 'normal',
          fontSize: '18px',
          color: '#707070'
        }
      },
      plotOptions: {
        series: {
          shadow: false,
          turboThreshold: Infinity,
        }
      },
      series: series
    };
    this.spinnerClass = '';
  }

  public selectedMoment = new Date();//moment().formate();
  //public selectedMoments = [new Date(2018, 1, 12, 10, 30), new Date(2018, 3, 21, 20, 30)];

  onSearchClick() {
    this.getReadingData();
  }

  mouseover(e) {
    //console.log(e)
  }

}
