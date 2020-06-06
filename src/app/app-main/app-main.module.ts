import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { S3itestMainComponent } from './s3itest/s3itest-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LineChartComponent } from '../package/charts/line-chart/line-chart.component';
import { SearchFormComponent } from '../package/forms/search-form/search-form.component';

import { AppMainRoutingModule } from './app-main-routing.module';
import { AppPaginationModule } from '../app-pagination/app-pagination.module';



@NgModule({
  declarations: [
    S3itestMainComponent,
    LineChartComponent,
    SearchFormComponent
  ],
  imports: [
    CommonModule,
    AppMainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FlexLayoutModule,
    AppPaginationModule,

    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FlexLayoutModule,

    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule

  ]
})
export class AppMainModule { }
