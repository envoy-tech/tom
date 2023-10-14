import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createClientForDefaultRegion } from "@/utils/aws-sdk";
import prisma from "@/utils/prisma";

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

            try {
              const request = await client.send(command);

              if (request.$metadata.httpStatusCode === 200) {
                const pgResponse = await prisma.profile.create({
                  data: {
                    email: credentials?.email as string,
                    name: credentials?.name as string,
                  },
                });
              }

              return {
                email: credentials?.email,
              };
            } catch (e) {
              return e;
            }
          } else {
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

            try {
              const request = await client.send(command);
              return {
                email: credentials?.email,
              };
            } catch (e) {
              return e;
            }
          }
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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //
      if (user && user.email) {
        return true;
      }

      // This means that we're returning the error state if this is the case.
      throw new Error(user.__type);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
