import {
  ConfirmSignUpCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { createClientForDefaultRegion } from "@/utils/aws-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, code } = await request.json();
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  });

  const response = await client.send(command);

  if (response.$metadata.httpStatusCode === 200) {
    return new Response("Success!", {
      status: 200,
    });
  } else {
    return new Response("Error!", {
      status: 500,
    });
  }
}
