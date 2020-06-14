import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { Response } from '../models/response';
// import { onError } from 'apollo-link-error';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private apollo: Apollo) { }

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

  getReadingData(buildingId: number, objectId: number | null, datafieldId: number | null, startTime: string, endTime: string, page: number, size: number): Observable<ApolloQueryResult<Response>> {
    return this.apollo.query({
      query: gql`{
        readingQuery {
          readings(buildingId: ${buildingId}, objectId: ${objectId}, datafieldId: ${datafieldId}, startTime: "${startTime}", endTime:  "${endTime}", page: ${page}, size: ${size}) {
            pageCount
            size
            totalCount
            data {
              buildingName
              datapointName
              timestamp
              value
            }
          }
        }
      }`
    });
  }

  getReadingLazyData(buildingId: number, objectId: number | null, datafieldId: number | null, startTime: string, endTime: string): Observable<ApolloQueryResult<Response>> {
    return this.apollo.query({
      query: gql`{
        readingQuery {
          readingsLazyData(buildingId: ${buildingId}, objectId: ${objectId}, datafieldId: ${datafieldId}, startTime: "${startTime}", endTime:  "${endTime}") { 
              buildingName
              datapointName
              timestamp
              value
          }
        }
      }
      `
    });
  }


}
