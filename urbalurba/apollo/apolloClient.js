import { useMemo } from 'react';
import fetch from 'cross-fetch';
// using apollo from react vs node has some differences see my https://stackoverflow.com/questions/64428473/using-apollo-in-node-no-react
import { ApolloClient, HttpLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { concatPagination } from '@apollo/client/utilities/utilities.cjs.js';
import { STRAPIURI } from "../lib/strapidatalib.js";

//import { setContext } from '@apollo/client/link/context';



let apolloClient;


/* This function works if NEXT_PUBLIC_JWT is assigned a token and you do query ...
function createApolloClient() {
    // Declare variable to store authToken
    let token;
  
    const httpLink = createHttpLink({
      uri: `${process.env.NEXT_PUBLIC_STRAPIURI}`,
      credentials: "same-origin",
    });
  
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
        console.log("createApolloClient GET token:", token);
      }
      //token = `${process.env.NEXT_PUBLIC_JWT}`;
      console.log("createApolloClient token:", token);

      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const client = new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      });
    
      return client;
    }
*/    


/* This works when the strapi graphql enpoint has no read restrictions */
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: STRAPIURI,
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      fetch
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allPosts: concatPagination(),
          },
        },
      },
    }),
  })
}
/* changed 
      uri: `${process.env.NEXT_PUBLIC_STRAPIURI}`,
to      
      uri: STRAPIURI,

/* */

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

