import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Items from './Items.tsx';
import Materials from './Materials.tsx';
import MetalFamilies from './MetalFamilies.tsx';
import Metals from './Metals.tsx';
import VolumePricing from './VolumePricing.tsx';
import InHouse from './InHouse.tsx';
import Outsourced from './Outsourced.tsx';
import StandardSetups from './StandardSetups.tsx';
import Todos from './Todos.js';

import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

const log = (msg) => console.log(`[SCENARIO] ${msg}`);

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

import { useAuth } from "react-oidc-context";

async function fetchMetalFamilies(ddbDocClient, setMetalFamilies) {
  const paginatedScan = paginateScan(
    { client: ddbDocClient },
    {
      TableName: "MetalFamilies",
      ConsistentRead: true,
    },
  );
  const families = [];
  for await (const page of paginatedScan) {
    families.push(...page.Items);
  }
  setMetalFamilies(families.map((f) => f.name));
};

async function fetchMetals(ddbDocClient, setMetals) {
  const paginatedScan = paginateScan(
    { client: ddbDocClient },
    {
      TableName: "Metals",
      ConsistentRead: true,
    },
  );
  const metals = [];
  for await (const page of paginatedScan) {
    metals.push(...page.Items);
  }
  setMetals(metals);
};

async function fetchMaterials(ddbDocClient, setMaterials) {
  const paginatedScan = paginateScan(
    { client: ddbDocClient },
    {
      TableName: "Materials",
      ConsistentRead: true,
    },
  );
  const materials = [];
  for await (const page of paginatedScan) {
    materials.push(...page.Items);
  }
  setMaterials(materials);
};

function getAwsCreds(auth) {
  //const auth = useAuth();
  const COGNITO_ID = "cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn";

  return fromCognitoIdentityPool({
    clientConfig: { region: "ap-southeast-2"},
    identityPoolId: 'ap-southeast-2:17fb9941-a165-4da3-ba04-66cf16623c07',
    logins: {
       [COGNITO_ID]: auth.user?.id_token,
    },
  })  
}

function MyTabs() {
  const [materials, setMaterials] = useState([]);
  const [metals, setMetals] = useState([]);
  const [metalFamilies, setMetalFamilies] = useState([]);

  const auth = useAuth();

  const client = new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: getAwsCreds(auth),
  });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  useEffect(() => {
    fetchMetalFamilies(ddbDocClient, setMetalFamilies)
    fetchMetals(ddbDocClient, setMetals)
  }, [])

  async function addMetalFamily(metalFamily) {
    log("addMetalFamily() " + metalFamily)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "MetalFamilies",
      Item: {
         name: metalFamily,
      },
    }));
    log(response);
    fetchMetalFamilies(ddbDocClient, setMetalFamilies)
  }

  async function addMetal(metal) {
    log("addMetal() " + metal.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Metals",
      Item: {
         name: metal.name,
         metalFamily: metal.metalFamily,
         density: metal.density,
      },
    }));
    log(response);
    fetchMetals(ddbDocClient, setMetals)
  }

  async function addMaterial(material) {
    log("addMaterial() " + material.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Materials",
      Item: material,
    }));
    log(response);
    fetchMaterials(ddbDocClient, setMaterials)
  }

  return (
  <Tabs>
    <TabList>
      <Tab>Items</Tab>
      <Tab>Materials</Tab>
      <Tab>Metals</Tab>
      <Tab>Metal Families</Tab>
      <Tab>Volume Pricing</Tab>
      <Tab>In House</Tab>
      <Tab>Outsourced</Tab>
      <Tab>Standard Setups</Tab>
      <Tab>Todos</Tab>
    </TabList>

    <TabPanel>
      <Items />
    </TabPanel>
    <TabPanel>
      <Materials
        materials={materials}
        metals={metals}
        metalFamilies={metalFamilies}
        addMaterial={addMaterial}
      />
    </TabPanel>
    <TabPanel>
      <Metals
        metals={metals}
        metalFamilies={metalFamilies}
        addMetal={addMetal}
      />
    </TabPanel>
    <TabPanel>
      <MetalFamilies
        metalFamilies={metalFamilies}
        addMetalFamily={addMetalFamily}
      />
    </TabPanel>
    <TabPanel>
      <VolumePricing />
    </TabPanel>
    <TabPanel>
      <InHouse />
    </TabPanel>
    <TabPanel>
      <Outsourced />
    </TabPanel>
    <TabPanel>
      <StandardSetups />
    </TabPanel>
    <TabPanel>
      <Todos />
    </TabPanel>
  </Tabs>
  );
}

export default MyTabs;
