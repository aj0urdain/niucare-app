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
