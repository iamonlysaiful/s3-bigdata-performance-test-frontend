import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private httpClient: HttpClient, private apollo: Apollo) { }

  getInitialChartData(): Observable<any[]> {
    //return this.httpClient.get<any[]>(`https://www.highcharts.com/samples/data/from-sql.php?callback=0`);
    return this.httpClient.get<any[]>(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=SH5VJ8C149PG8B7B&datatype=json`);
  }
  getPaginateChartData(start, end): Observable<any[]> {
    return this.httpClient.get<any[]>(`https://www.highcharts.com/samples/data/from-sql.php?start=${start}&end=${end}&callback=0`);
  }
  getBuildingsForDD(): Observable<ApolloQueryResult<Response>> {
    return this.apollo.query({
      query: gql`{
        bQuery{
          buildings{
            id,
            name
          }
        }
      }`
    });
  }
  getObjectsForDD(): Observable<ApolloQueryResult<Response>> {
    return this.apollo.query({
      query: gql`{
        objQuery{
          objects{
            id,
            name
          }
        }
      }`
    });
  }
  getDataFieldsForDD(): Observable<ApolloQueryResult<Response>> {
    return this.apollo.query({
      query: gql`{
        dfieldQuery{
          datafields{
            id,
            name
          }
        }
      }`
    });
  }

  //  startTime: "10-05-201812-00-00-AM", endTime: "10-07-201811-59-00-PM"

  getReadingData(buildingId:number,objectId:number,datafieldId:number,startTime:string,endTime:string): Observable<ApolloQueryResult<Response>> {
    return this.apollo.query({
      query: gql`{
        readingQuery {
          readings(buildingId: ${buildingId}, objectId: ${objectId}, datafieldId: ${datafieldId}, startTime: "${startTime}", endTime:  "${endTime}") {
            timestamp
            value
            buildingName
            objectName
            dataFieldName
          }
        }
      }
      `
    });
  }
}
