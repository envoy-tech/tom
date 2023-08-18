import {
  ResendConfirmationCodeCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { createClientForDefaultRegion } from "@/utils/aws-sdk";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const { email } = await request.json();
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient);

  const command = new ResendConfirmationCodeCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
  });

  const response = await client.send(command);

  if (response.$metadata.httpStatusCode === 200) {
    return NextResponse.json("Success!", {
      status: 200,
    });
  } else {
    return new Response(null, {
      status: 500,
      statusText: "A Server error has occured.",
    });
  }
}
