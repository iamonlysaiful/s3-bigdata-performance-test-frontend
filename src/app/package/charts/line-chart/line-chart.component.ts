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
  @Input() spinnerClass: any;
  @Output() pageChangeRequest = new EventEmitter();
  @Output() sizeChangeRequest = new EventEmitter();

  readingSeries = [{
    name: '',
    data: [],
    turboThreshold: 1,
    color: '#1c4c74',
    lineWidth: 1,
    dataGrouping: {
      enabled: false
    },
    type: 'line'
  }];
  chartOptions: any;
  highcharts = Highcharts;
  maxDistance = 24 * 3600 * 1000;
  selectedSize = '1';
  totalPage = 1;
  color: string[] = ['#1c4c74', '#800080', '#008000', '#FF0000', '#800000']
  chartDateRange = [new Date(2018, 4, 10, 0, 0), new Date(2018, 4, 12, 23, 59)];
  constructor() { }

  ngOnInit(): void {
    this.generateReadingChart(this.readingSeries, false);
  }

  ngOnChanges() {
    if (this.readingData !== undefined) {
      debugger
      this.chartDateRange = this.readingData.chartDateRange;
      this.getChart(this.readingData.chartData);
      if (this.readingData.chartData.size<Number(this.selectedSize)) {
        this.pageSizeSelectionChange({ activePage: 1, size: 1 });
        this.selectedSize = '1';
      }
    }
  }

  displayActivePage(event) {
    this.pageChangeRequest.emit(event);
  }

  pageSizeSelectionChange(event) {
    this.selectedSize = event.size;
    this.sizeChangeRequest.emit(event);
  }

  getChart(res) {
    this.totalPage = res.pageCount;
    this.readingSeries = [];
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      this.readingSeries.push({
        name: element.datapointName,
        data: _.zip(
          _.sortBy(element.timestamp, function (date) {
            return date;
          }),
          _.sortBy(element.value, function (value) {
            return value;
          })
        ),
        turboThreshold: Infinity,
        color: this.color[index],
        lineWidth: 1,
        dataGrouping: {
          enabled: false
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
        }
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
          afterSetExtremes: function (e) {
            var chart = Highcharts.charts[0];
            chart.showLoading('Loading data from server...');
            chart.hideLoading();
          }
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
        }
      },
      series: series
    };
  }


}
