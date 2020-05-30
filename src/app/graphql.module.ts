import { NgModule, NgZone } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { SnackbarService } from './service/snackbar.service';

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [],
})
export class GraphQLModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink,private snackbar:SnackbarService) { 
    const link = onError(({ graphQLErrors, networkError }) => {
      if(graphQLErrors){
        graphQLErrors.map(({ message, locations, path }) => {
          debugger
          snackbar.open(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          //console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        })
      }
      if(networkError){
          snackbar.open(`[Network error]: ${networkError.message}`);
          //console.log(`[Network error]: ${networkError}`);
      }
    });

    apollo.create(
      {
        link : ApolloLink.from([link, httpLink.create({ uri: "http://localhost:58719/graphql" })]) ,
        cache: new InMemoryCache(),
        defaultOptions : {
          watchQuery : {
            fetchPolicy : 'network-only',
            errorPolicy : 'all'
          }
        }
      },
      "default"
    );  
  }
}
