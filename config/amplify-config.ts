/**
 * File: config/amplify-config.ts
 * Description: AWS Amplify configuration for authentication and storage services
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { Amplify } from "aws-amplify";

/**
 * Configures AWS Amplify with authentication and storage settings
 *
 * This function sets up:
 * - Cognito authentication with OAuth
 * - S3 storage configuration
 * - Server-side rendering support
 *
 * @returns {void}
 *
 * @example
 * ```ts
 * configureAmplify();
 * ```
 */
export function configureAmplify() {
  Amplify.configure(
    {
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
      Storage: {
        S3: {
          bucket: process.env.NEXT_PUBLIC_BUCKET_NAME ?? "",
          region: process.env.NEXT_PUBLIC_AWS_REGION ?? "",
        },
      },
    },
    {
      ssr: true,
    }
  );
}
