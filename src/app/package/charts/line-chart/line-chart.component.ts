import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/boost')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
import * as _ from 'underscore';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() chartData: any;
  @Input() spinnerClass: any;

  readingSeries = [{
    name: '', data: [],
    turboThreshold: 1,
    color: '#1c4c74',
    lineWidth: 1,
    dataGrouping: {
      enabled: false
    }
  }];
  chartOptions: any;
  highcharts = Highcharts;
  maxDistance = 24 * 3600 * 1000;

  constructor() { }

  ngOnInit(): void {
    this.generateReadingChart(this.readingSeries);
  }

  ngOnChanges() {
    if (this.chartData !== undefined) {
      this.getChartData(this.chartData);
    }
  }

  getChartData(data) {
    this.readingSeries = [];
    this.readingSeries.push({
      name: data.objectName + ' ' + data.dataFieldName,
      data: _.zip(data.timestamp, data.value),
      //type: "line",
      turboThreshold: Infinity,
      color: '#1c4c74',
      lineWidth: 1,
      dataGrouping: {
        enabled: false
      }
    });
    this.generateReadingChart(this.readingSeries);
  }

  displayChart() {
    if (this.spinnerClass !== 'end') {
      return 'none'
    }
  }

  generateReadingChart(series, data = null) {
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
          data: series[0].data,
        }
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
        //selected:1,
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

            if (e.trigger === undefined) {
              this.maxDistance = this.maxDistance === undefined ? 24 * 3600 * 1000 : this.maxDistance;
              var xaxis = this;
              if ((e.dataMax - e.dataMin) > this.maxDistance) {
                var min = e.dataMin;
                var max = e.dataMin + this.maxDistance;
                window.setTimeout(function () {
                  xaxis.setExtremes(min, max);
                }, 1);
              }
            }

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
          fontSize: '22px',
          fontFamily: 'calibri',
          color: '#1c4c74'
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
  }



}
