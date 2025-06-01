/**
 * File: config/aws-config.ts
 * Description: AWS configuration object for authentication settings
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

// import { Amplify } from "aws-amplify";

// Amplify.configure({
//   Auth: {
//     region: process.env.NEXT_PUBLIC_AWS_REGION,
//     userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
//     userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
//     identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
//     oauth: {
//       domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//       scope: ["email", "openid", "profile"],
//       redirectSignIn: process.env.NEXT_PUBLIC_AUTH_REDIRECT,
//       redirectSignOut: process.env.NEXT_PUBLIC_AUTH_REDIRECT,
//       responseType: "code",
//     },
//   },
// });

/**
 * AWS Configuration object for authentication settings
 *
 * This configuration object contains:
 * - Cognito user pool settings
 * - OAuth configuration
 * - Identity pool settings
 *
 * @type {Object}
 * @property {Object} Auth - Authentication configuration
 * @property {Object} Auth.Cognito - Cognito-specific settings
 * @property {string} Auth.Cognito.userPoolId - Cognito user pool ID
 * @property {string} Auth.Cognito.userPoolClientId - Cognito user pool client ID
 * @property {string} Auth.Cognito.identityPoolId - Cognito identity pool ID
 * @property {Object} Auth.Cognito.loginWith - Login configuration
 * @property {Object} Auth.Cognito.loginWith.oauth - OAuth settings
 *
 * @example
 * ```ts
 * import { config } from './aws-config';
 * // Use config.Auth.Cognito for authentication settings
 * ```
 */
export const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ?? "",
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID ?? "",
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN ?? "",
          scopes: [
            "phone",
            "email",
            "profile",
            "openid",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: [process.env.NEXT_PUBLIC_AUTH_REDIRECT ?? ""],
          redirectSignOut: [process.env.NEXT_PUBLIC_AUTH_REDIRECT ?? ""],
          responseType: "code",
        },
      },
    },
  },
};
