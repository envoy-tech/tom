import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"; // ES Modules import
// const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = new SESClient({
    credentials: {
      accessKeyId: "MYKEY",
      secretAccessKey: "MYOTHERKEY",
    },
    region: "us-east-1",
  });
  const input = {
    // SendEmailRequest
    Source: "STRING_VALUE", // required
    Destination: {
      // Destination
      ToAddresses: [
        // AddressList
        "STRING_VALUE",
      ],
      CcAddresses: ["STRING_VALUE"],
      BccAddresses: ["STRING_VALUE"],
    },
    Message: {
      // Message
      Subject: {
        // Content
        Data: "STRING_VALUE", // required
        Charset: "STRING_VALUE",
      },
      Body: {
        // Body
        Text: {
          Data: "STRING_VALUE", // required
          Charset: "STRING_VALUE",
        },
        Html: {
          Data: "STRING_VALUE", // required
          Charset: "STRING_VALUE",
        },
      },
    },
    ReplyToAddresses: ["STRING_VALUE"],
    ReturnPath: "STRING_VALUE",
    SourceArn: "STRING_VALUE",
    ReturnPathArn: "STRING_VALUE",
    Tags: [
      // MessageTagList
      {
        // MessageTag
        Name: "STRING_VALUE", // required
        Value: "STRING_VALUE", // required
      },
    ],
    ConfigurationSetName: "STRING_VALUE",
  };
  const command = new SendEmailCommand(input);
  const response = await client.send(command);
  // { // SendEmailResponse
  //   MessageId: "STRING_VALUE", // required
  // };

  if (response.$metadata.httpStatusCode === 200) {
    return NextResponse.json("Success!", {
      status: 200,
    });
  }
}
