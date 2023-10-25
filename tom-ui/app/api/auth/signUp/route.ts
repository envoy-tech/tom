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

  try {
    const cognitoResponse = await client.send(command);

    if (cognitoResponse.$metadata.httpStatusCode === 200) {
      return NextResponse.json("Success!", {
        status: 200,
      });
    }
  } catch (e) {
    return NextResponse.json(
      { error: true, errorMessage: e.message },
      { status: 200 }
    );
  }
}
