import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createClientForDefaultRegion } from "@/lib/utils/aws-sdk";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
        name: {
          label: "Name",
          type: "text",
          required: "false",
        },
      },
      async authorize(credentials, req) {
        console.debug("****createCredential: ", JSON.stringify(credentials));

        const newUser = req.query?.newUser;

        if (newUser !== undefined && newUser !== null) {
          const client = createClientForDefaultRegion(
            CognitoIdentityProviderClient
          );

          // If it is a new User
          if (String(newUser).toLowerCase() === "true") {
            const command = new SignUpCommand({
              ClientId: process.env.COGNITO_CLIENT_ID,
              Username: credentials?.email as string,
              Password: credentials?.password as string,
              UserAttributes: [{ Name: "name", Value: credentials?.name }],
            });

            client.send(command);
          }
          // If signing into an existing User, and still log them in even so.

          const command = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: {
              USERNAME: credentials?.email as string,
              PASSWORD: credentials?.password as string,
              EMAIL: credentials?.email as string,
            },
            ClientId: process.env.COGNITO_CLIENT_ID,
          });

          client.send(command);

          return command.input.UserContextData;
        } else {
          throw new Error("Missing query parameters.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/register/1",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
