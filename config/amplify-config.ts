import { Amplify } from "aws-amplify";

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
    },
    {
      ssr: true,
    }
  );
}
