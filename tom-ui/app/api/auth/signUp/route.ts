import {
  ConfirmSignUpCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { createClientForDefaultRegion } from "@/utils/aws-sdk";
import { NextResponse } from "next/server";
import { ERROR_MAP } from "@/utils/constants";

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
    return NextResponse.json("Success!", {
      status: 200,
    });
  } else if (response.$metadata.httpStatusCode === 400) {
    let error = ERROR_MAP[response.__type];

    if (!error) {
      console.error(error);
      error = "An unhandled error has occured.";
    }

    return new Response(null, {
      status: 400,
      statusText: error,
    });
  } else {
    return new Response(null, {
      status: 500,
      statusText: "A Server error has occured.",
    });
  }
}
