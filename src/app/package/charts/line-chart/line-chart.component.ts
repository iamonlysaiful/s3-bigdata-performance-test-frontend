import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/boost')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() readingData: any;
  @Output() pageChangeRequest = new EventEmitter();
  @Output() sizeChangeRequest = new EventEmitter();
  @Output() LazyLoadRequest = new EventEmitter<object>();

  spinnerClass: any = 'start';
  readingSeries = [{
    name: '',
    data: [],
    zones: [],
    turboThreshold: 1,
    boostThreshold: 1,
    color: '#1c4c74',
    lineWidth: 1,
    dataGrouping: {
      enabled: false
    },
    type: 'line'
  }];
  chartOptions: any;
  highcharts = Highcharts;
  selectedSize = '1';
  totalPage = 1;
  // color: string[] = ['#1c4c74', '#800080', '#008000', '#FFBD33', '#75FF33', '#33FFBD', '#F45B5B', '#F7A35C', '#F45B5B', '#AA33FF', '#FF0000']
  color: string[] = ['#1c4c74', "#ff349a", '#0000ff', "#644c00", "#e66914", "#48ffff", "#008200", "#da00da", "#595959", "#5700ad", '#FF0000']
  baselineList = [
    { name: 'System Efficiency', value: 0.45, type: 'less' },
    { name: 'System Cooling Load', value: 400000, type: 'greater' },
  ]
  chartDateCount: number = 1;
  //chartDateRange = [new Date(2018, 4, 10, 0, 0), new Date(2018, 4, 12, 23, 59)];
  counter = 1;

  constructor() { }

  ngOnInit(): void {
    this.generateReadingChart(this.readingSeries, false);
  }

  ngOnChanges() {
    if (this.readingData !== undefined) {
      this.spinnerClass = 'start'
      //this.chartDateRange = this.readingData.chartDateRange;
      this.getChart(this.readingData);
      if (this.readingData.size < Number(this.selectedSize)) {
        this.pageSizeSelectionChange({ activePage: 1, size: 1 });
        this.selectedSize = '1';
      }

    }
  }

  displayActivePage(event) {
    this.spinnerClass = 'start'
    this.pageChangeRequest.emit(event);
  }

  pageSizeSelectionChange(event) {
    debugger
    this.spinnerClass = 'start'
    this.selectedSize = event.size;
    this.sizeChangeRequest.emit(event);
  }

  getChart(res) {
    this.totalPage = res.pageCount;
    this.readingSeries = [];
    this.chartDateCount = res.totalCount;
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      let zoneData = [];
      let baselineObject = this.baselineList.find(x => x.name == element.datapointName);
      if (baselineObject !== undefined) {
        if (baselineObject.type == 'less') {
          zoneData.push({
            value: baselineObject.value,
            color: this.color[this.color.length - 1]
          }, {
            color: this.color[index]
          });
        } else {
          zoneData.push({
            value: baselineObject.value,
            color: this.color[index]
          }, {
            color: this.color[this.color.length - 1]
          });
        }
      }
      // else if (element.datapointName == 'System Cooling Load') {
      //   zoneData.push({
      //     value: 400000,
      //     color: this.color[index]
      //   }, {
      //     color: this.color[this.color.length - 1]
      //   });
      // }
      this.readingSeries.push({
        name: element.datapointName,
        data: _.zip(element.timestamp, element.value),
        zones: zoneData,
        turboThreshold: Infinity,
        boostThreshold: Infinity,
        color: this.color[index],
        lineWidth: 1,
        dataGrouping: {
          enabled: true
        },
        type: 'line'
      });
    }
    this.generateReadingChart(this.readingSeries, true);

  }

  displayChart() {
    if (this.spinnerClass !== 'end') {
      return 'none'
    }
  }

  generateReadingChart(series, legendView) {
    console.log(series);
    this.chartOptions = {
      chart: {
        type: "line",
        zoomType: 'x',
        animation: {
          duration: 1000
        }
      },
      boost: {
        enabled: true,
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
        series: series
      },
      rangeSelector: {
        enabled: true,
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
        style: {
          fontWeight: 'normal',
          color: '#1c4c74'
        },
      },
      title: {
        text: ""
      },
      useHighStocks: true,
      xAxis: {
        title: {
          text: "Time",
          style: {
            fontWeight: 'normal',
            fontSize: '14px',
            color: '#1c4c74'
          }
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
        events: {
          afterSetExtremes: (e) => {
            this.afterSetExtremes(e);
          } 
          //this.afterSetExtremes
          // function (e) {
          //   var chart = Highcharts.charts[0];
          //   chart.showLoading('Loading data from server...');
          //   chart.hideLoading();

          // }
        },
      },
      yAxis: {
        title: {
          text: "Value",
          style: {
            fontWeight: 'normal',
            fontSize: '14px',
            color: '#1c4c74'
          }
        },
        //   plotLines: [{
        //     value: 400,
        //     color: 'red',
        //     dashStyle: 'solid',
        //     width: 2
        // }, {
        //     value: 0.59,
        //     color: 'red',
        //     dashStyle: 'solid',
        //     width: 2
        // }]
      },
      tooltip: {
        formatter: function () {
          return moment.utc(this.point.category).format('DD/MM/YY HH:mm') + " hrs<br/>" + this.series.name + " " + Highcharts.numberFormat(this.y, 2, '.', ',');
        }
      },
      lang: {
        noData: "No data to display"
      },
      noData: {
        style: {
          fontWeight: 'normal',
          fontSize: '22px',
          fontFamily: 'calibri',
          color: '#1c4c74'
        }
      },
      legend: {
        enabled: legendView,
        layout: 'horizontal',
        x: 30,
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 2,
        itemStyle: {
          fontWeight: 'normal'
        },
      },
      plotOptions: {
        series: {
          shadow: false,
          turboThreshold: Infinity,
          boostThreshold: Infinity
        }
      },
      series: series
    };
    setTimeout(() => {
      this.spinnerClass = 'end'
    }, 500);
  }

  afterSetExtremes(e) {
    debugger
    var chart = Highcharts.charts[0];
    chart.showLoading('Loading data from server...');
    let diff=(e.max - e.min);
    let month=30 * 24 * 3600 * 1000;
    if (e.trigger=='zoom' && diff>month) {
      this.LazyLoadRequest.emit({ startDate: Math.round(e.min), endDate: Math.round(e.max) });
      for (let index = 0; index < chart.series.length; index++) {
        const element = this.readingData.data[index];
        chart.series[0].setData(_.zip(element.timestamp, element.value));
      }
      chart.hideLoading();
    }else{
      chart.hideLoading();
    }   
  }
}
