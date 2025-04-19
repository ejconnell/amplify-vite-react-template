import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Items from './Items.tsx';
import Materials from './Materials.tsx';
import MetalFamilies from './MetalFamilies.tsx';
import Metals from './Metals.tsx';
import Quotes from './Quotes.tsx';
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
  setMetalFamilies(families);
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

async function fetchStandardSetups(ddbDocClient, setStandardSetups) {
  const paginatedScan = paginateScan(
    { client: ddbDocClient },
    {
      TableName: "StandardSetups",
      ConsistentRead: true,
    },
  );
  const standardSetups = [];
  for await (const page of paginatedScan) {
    standardSetups.push(...page.Items);
  }
  setStandardSetups(standardSetups);
};

async function fetchInHouses(ddbDocClient, setInHouses) {
  await fetchTable(ddbDocClient, setInHouses, "InHouses")
};

async function fetchItems(ddbDocClient, setItems) {
  await fetchTable(ddbDocClient, setItems, "Items")
};

async function fetchTable(ddbDocClient, setter, tableName) {
  console.log(`fetchTable("${tableName}")`)
  const paginatedScan = paginateScan(
    { client: ddbDocClient },
    {
      TableName: tableName,
      ConsistentRead: true,
    },
  );
  const acc = [];
  for await (const page of paginatedScan) {
    acc.push(...page.Items);
  }
  setter(acc);
}

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
  const [fetchesComplete, setFetchesComplete] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [metals, setMetals] = useState([]);
  const [metalFamilies, setMetalFamilies] = useState([]);
  const [standardSetups, setStandardSetups] = useState([]);
  const [inHouses, setInHouses] = useState([]);
  const [items, setItems] = useState([]);

  const auth = useAuth();

  const client = new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: getAwsCreds(auth),
  });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  useEffect(() => {
    console.log(`fetchesComplete 1: ${fetchesComplete}`);
    Promise.all([
      fetchMetalFamilies(ddbDocClient, setMetalFamilies),
      fetchMetals(ddbDocClient, setMetals),
      fetchMaterials(ddbDocClient, setMaterials),
      fetchStandardSetups(ddbDocClient, setStandardSetups),
      fetchInHouses(ddbDocClient, setInHouses),
      fetchItems(ddbDocClient, setItems),
    ]).then(() => setFetchesComplete(true));
  }, [])

  async function addMetalFamily(metalFamily) {
    log("addMetalFamily() " + metalFamily.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "MetalFamilies",
      Item: {
         name: metalFamily.name,
      },
    }));
    log(JSON.stringify(response));
    fetchMetalFamilies(ddbDocClient, setMetalFamilies);
  }

  async function addMetal(metal) {
    log("addMetal() " + metal.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Metals",
      Item: metal,
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

  async function addStandardSetup(standardSetup) {
    log("addStandardSetup() " + standardSetup.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "StandardSetups",
      Item: standardSetup,
    }));
    log(response);
    fetchStandardSetups(ddbDocClient, setStandardSetups);
  }

  async function addInHouse(inHouse) {
    log("addInHouse() " + inHouse.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "InHouses",
      Item: inHouse,
    }));
    log(response);
    fetchInHouses(ddbDocClient, setInHouses);
  }

  async function addItem(item) {
    log("addItem() " + item.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Items",
      Item: item,
    }));
    log(response);
    fetchItems(ddbDocClient, setItems);
  }

  if (!fetchesComplete) {
    return <h1>Loading...</h1>
  }

  return (
  <Tabs>
    <TabList>
      <Tab>Metals</Tab>
      <Tab>Items</Tab>
      <Tab>Materials</Tab>
      <Tab>Metal Families</Tab>
      <Tab>Quotes</Tab>
      <Tab>In House</Tab>
      <Tab>Outsourced</Tab>
      <Tab>Standard Setups</Tab>
      <Tab>Todos</Tab>
    </TabList>

    <TabPanel>
      <Metals
        metals={metals}
        metalFamilies={metalFamilies}
        addMetal={addMetal}
      />
    </TabPanel>
    <TabPanel>
      <Items
        items={items}
        materials={materials}
        standardSetups={standardSetups}
        inHouses={inHouses}
        addItem={addItem}
      />
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
      <MetalFamilies
        metalFamilies={metalFamilies}
        addMetalFamily={addMetalFamily}
      />
    </TabPanel>
    <TabPanel>
      <Quotes
        items={items}
        materials={materials}
        inHouses={inHouses}
      />
    </TabPanel>
    <TabPanel>
      <InHouse
        inHouses={inHouses}
        addInHouse={addInHouse}
      />
    </TabPanel>
    <TabPanel>
      <Outsourced />
    </TabPanel>
    <TabPanel>
      <StandardSetups
        standardSetups={standardSetups}
        addStandardSetup={addStandardSetup}
      />
    </TabPanel>
    <TabPanel>
      <Todos />
    </TabPanel>
  </Tabs>
  );
}

export default MyTabs;
