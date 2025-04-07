import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import {
  BillingMode,
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  paginateQuery,
  paginateScan,
} from "@aws-sdk/lib-dynamodb";

import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";
import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";

// Strips the token ID from the URL after authentication.
window.getToken = function () {
  var idtoken = window.location.href;
  var idtoken1 = idtoken.split("=")[1];
  var idtoken2 = idtoken1.split("&")[0];
  var idtoken3 = idtoken2.split("&")[0];
  return idtoken3;
};


function MetalFamilies() {
  const log = (msg) => console.log(`[SCENARIO] ${msg}`);

  let idToken = getToken();
  idToken = "c99e6488-f021-701c-cf8b-4bef3a5158c7";
  let COGNITO_ID = "cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn";
  let loginData = {
    [COGNITO_ID]: idToken,
  };

  const cogIdClient = new CognitoIdentityClient({
      region: "ap-southeast-2",
  });
  const input2 = { // GetIdInput
    IdentityPoolId: 'ap-southeast-2:17fb9941-a165-4da3-ba04-66cf16623c07',
   Logins: {
      [COGNITO_ID]: idToken,
    },
  };
  const command2 = new GetIdCommand(input2);
  const response2 = cogIdClient.send(command2);
  log(JSON.stringify(response2));

  const client = new DynamoDBClient({
      region: "ap-southeast-2",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "ap-southeast-2"}, // Configure the underlying CognitoIdentityClient.
        identityPoolId: 'ap-southeast-2:17fb9941-a165-4da3-ba04-66cf16623c07',
        logins: loginData,
      })
  });
  const docClient = DynamoDBDocumentClient.from(client);

  const input = {
/*
    ExclusiveStartTableName: "STRING_VALUE",
    Limit: Number("int"),
*/
  };
  const command = new ListTablesCommand(input);
/*
  const response = client.send(command);
  log(JSON.stringify(response));

  const paginatedScan = paginateScan(
    { client: docClient },
    {
      TableName: "MetalFamilies",
      ConsistentRead: true,
    },
  );

  log(JSON.stringify(paginatedScan))
*/
  const metalFamilies = [];
/*
  for await (const page of paginatedScan) {
    metalFamilies.push(...page.Items);
  }
*/
  log(JSON.stringify(metalFamilies));

  return (
   <>
    <h1>Metal Families page {JSON.stringify(metalFamilies)}</h1>
    <h2>{JSON.stringify(idToken)}</h2>
   </>
  );
}

export default MetalFamilies;
