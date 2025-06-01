/**
 * @file apollo-provider.tsx
 * @description Apollo Client provider with error handling, authentication, and REST integration
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { fetchAuthSession } from "aws-amplify/auth";
import { RestLink } from "apollo-link-rest";

/**
 * Error handling link for Apollo Client
 * Handles GraphQL errors, network errors, and provides retry logic
 * @type {ApolloLink}
 */
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // Log the error details
        console.error(
          `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
        );

        // Handle specific error codes
        const errorCode = err.extensions?.code;
        switch (errorCode) {
          case "UNAUTHENTICATED":
            // Handle authentication errors
            console.error("Authentication error - please log in again");
            // You could trigger a re-authentication flow here
            break;
          case "FORBIDDEN":
            // Handle permission errors
            console.error(
              "Permission denied - you do not have access to this resource"
            );
            break;
          case "BAD_USER_INPUT":
            // Handle validation errors
            console.error("Invalid input:", err.extensions?.validationErrors);
            break;
          case "INTERNAL_SERVER_ERROR":
            // Handle server errors
            console.error("Server error occurred:", err.message);
            break;
          case "NOT_FOUND":
            // Handle not found errors
            console.error("Resource not found:", err.message);
            break;
          default:
            // Handle other GraphQL errors
            console.error("GraphQL error:", err);
        }

        // If we have an operation and forward, we can retry the operation
        if (operation && forward) {
          // Only retry for certain error types
          if (
            ["UNAUTHENTICATED", "INTERNAL_SERVER_ERROR"].includes(
              errorCode as string
            )
          ) {
            return forward(operation);
          }
        }
      }
    }

    if (networkError) {
      // Handle network errors
      console.error(`[Network error]: ${networkError}`);

      // Check if it's a ServerError (which has statusCode)
      if ("statusCode" in networkError) {
        const serverError = networkError as { statusCode: number };

        // Check if it's a 401 Unauthorized error
        if (serverError.statusCode === 401) {
          console.error("Session expired - please log in again");
          // You could trigger a re-authentication flow here
        }

        // Check if it's a 403 Forbidden error
        if (serverError.statusCode === 403) {
          console.error("Access denied - insufficient permissions");
        }

        // Check if it's a 404 Not Found error
        if (serverError.statusCode === 404) {
          console.error("Resource not found");
        }

        // Check if it's a 500 Server Error
        if (serverError.statusCode === 500) {
          console.error("Server error occurred");
        }
      }

      // If we have an operation and forward, we can retry the operation
      if (operation && forward) {
        // Only retry for certain status codes
        if ("statusCode" in networkError) {
          const serverError = networkError as { statusCode: number };
          if ([500, 503, 504].includes(serverError.statusCode)) {
            return forward(operation);
          }
        }
      }
    }
  }
);

/**
 * Authentication link for Apollo Client
 * Adds the authentication token to request headers
 * @type {ApolloLink}
 */
const authLink = setContext(async (_, { headers }) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString() || "";

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } catch (error) {
    console.error("Error getting auth token:", error);
    return { headers };
  }
});

/**
 * REST link for OpenFGA integration
 * @type {RestLink}
 */
const restLink = new RestLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT, // https://api.staging.niucare.com/api
});

/**
 * HTTP link for GraphQL operations
 * @type {HttpLink}
 */
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, // https://api.staging.niucare.com/graphql
});

/**
 * Apollo Client instance with configured links and cache
 * @type {ApolloClient}
 */
const client = new ApolloClient({
  link: from([errorLink, authLink, restLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  connectToDevTools: true,
});

/**
 * Apollo Provider component that wraps the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} Apollo Provider component
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ApolloWrapper>
 *       <YourApp />
 *     </ApolloWrapper>
 *   );
 * }
 * ```
 */
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
