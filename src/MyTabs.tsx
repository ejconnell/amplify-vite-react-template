import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Items from './Items.tsx';
import Materials from './Materials.tsx';
import MetalFamilies from './MetalFamilies.tsx';
import Metals from './Metals.tsx';
import Quotes from './Quotes.tsx';
import InHouses from './InHouses.tsx';
import Outsourcings from './Outsourcings.tsx';
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

async function loadMetalFamilies(ddbDocClient, setMetalFamilies) {
  await loadTable(ddbDocClient, setMetalFamilies, "MetalFamilies")
};

async function loadMetals(ddbDocClient, setMetals) {
  await loadTable(ddbDocClient, setMetals, "Metals")
};

async function loadMaterials(ddbDocClient, setMaterials) {
  await loadTable(ddbDocClient, setMaterials, "Materials")
};

async function loadStandardSetups(ddbDocClient, setStandardSetups) {
  await loadTable(ddbDocClient, setStandardSetups, "StandardSetups")
};

async function loadInHouses(ddbDocClient, setInHouses) {
  await loadTable(ddbDocClient, setInHouses, "InHouses")
};

async function loadOutsourcings(ddbDocClient, setOutsourcings) {
  await loadTable(ddbDocClient, setOutsourcings, "Outsourcings")
};

async function loadItems(ddbDocClient, setItems) {
  await loadTable(ddbDocClient, setItems, "Items")
};

async function loadTable(ddbDocClient, setter, tableName) {
  console.log(`loadTable("${tableName}")`)
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
  const [loadsComplete, setFetchesComplete] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [metals, setMetals] = useState([]);
  const [metalFamilies, setMetalFamilies] = useState([]);
  const [standardSetups, setStandardSetups] = useState([]);
  const [inHouses, setInHouses] = useState([]);
  const [outsourcings, setOutsourcings] = useState([]);
  const [items, setItems] = useState([]);

  const auth = useAuth();

  const client = new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: getAwsCreds(auth),
  });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  useEffect(() => {
    console.log(`loadsComplete 1: ${loadsComplete}`);
    Promise.all([
      loadMetalFamilies(ddbDocClient, setMetalFamilies),
      loadMetals(ddbDocClient, setMetals),
      loadMaterials(ddbDocClient, setMaterials),
      loadStandardSetups(ddbDocClient, setStandardSetups),
      loadInHouses(ddbDocClient, setInHouses),
      loadOutsourcings(ddbDocClient, setOutsourcings),
      loadItems(ddbDocClient, setItems),
    ]).then(() => setFetchesComplete(true));
  }, [])

  async function saveMetalFamily(metalFamily) {
    log("saveMetalFamily() " + metalFamily.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "MetalFamilies",
      Item: {
         name: metalFamily.name,
      },
    }));
    log(JSON.stringify(response));
    loadMetalFamilies(ddbDocClient, setMetalFamilies);
  }

  async function saveMetal(metal) {
    log("saveMetal() " + metal.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Metals",
      Item: metal,
    }));
    log(response);
    loadMetals(ddbDocClient, setMetals)
  }

  async function saveMaterial(material) {
    log("saveMaterial() " + material.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Materials",
      Item: material,
    }));
    log(response);
    loadMaterials(ddbDocClient, setMaterials)
  }

  async function saveStandardSetup(standardSetup) {
    log("saveStandardSetup() " + standardSetup.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "StandardSetups",
      Item: standardSetup,
    }));
    log(response);
    loadStandardSetups(ddbDocClient, setStandardSetups);
  }

  async function saveInHouse(inHouse) {
    log("saveInHouse() " + inHouse.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "InHouses",
      Item: inHouse,
    }));
    log(response);
    loadInHouses(ddbDocClient, setInHouses);
  }

  async function saveOutsourcing(outsourcing) {
    log("saveOutsourcing() " + outsourcing.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Outsourcings",
      Item: outsourcing,
    }));
    log(response);
    loadOutsourcings(ddbDocClient, setOutsourcings);
  }

  async function saveItem(item) {
    log("saveItem() " + item.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Items",
      Item: item,
    }));
    log(response);
    loadItems(ddbDocClient, setItems);
  }

  if (!loadsComplete) {
    return <h1>Loading...</h1>
  }

  return (
  <Tabs>
    <TabList>
      <Tab>Items</Tab>
      <Tab>Materials</Tab>
      <Tab>Metals</Tab>
      <Tab>Metal Families</Tab>
      <Tab>Quotes</Tab>
      <Tab>In Houses</Tab>
      <Tab>Outsourcings</Tab>
      <Tab>Standard Setups</Tab>
      <Tab>Todos</Tab>
    </TabList>

    <TabPanel>
      <Items
        items={items}
        materials={materials}
        metals={metals}
        standardSetups={standardSetups}
        inHouses={inHouses}
        outsourcings={outsourcings}
        saveItem={saveItem}
      />
    </TabPanel>
    <TabPanel>
      <Materials
        materials={materials}
        metals={metals}
        metalFamilies={metalFamilies}
        saveMaterial={saveMaterial}
      />
    </TabPanel>
    <TabPanel>
      <Metals
        metals={metals}
        metalFamilies={metalFamilies}
        saveMetal={saveMetal}
      />
    </TabPanel>
    <TabPanel>
      <MetalFamilies
        metalFamilies={metalFamilies}
        saveMetalFamily={saveMetalFamily}
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
      <InHouses
        inHouses={inHouses}
        saveInHouse={saveInHouse}
      />
    </TabPanel>
    <TabPanel>
      <Outsourcings
        outsourcings={outsourcings}
        saveOutsourcing={saveOutsourcing}
      />
    </TabPanel>
    <TabPanel>
      <StandardSetups
        standardSetups={standardSetups}
        saveStandardSetup={saveStandardSetup}
      />
    </TabPanel>
    <TabPanel>
      <Todos />
    </TabPanel>
  </Tabs>
  );
}

export default MyTabs;
