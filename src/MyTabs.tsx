import { useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Items from './Items.tsx';
import Materials from './Materials.tsx';
import MetalFamilies from './MetalFamilies.tsx';
import Metals from './Metals.tsx';
import Quotes from './Quotes.tsx';
import InHouses from './InHouses.tsx';
import Outsourcings from './Outsourcings.tsx';
import StandardSetups from './StandardSetups.tsx';
import Labels from './Labels';

import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

const log = (msg) => console.log(`[MyTabs] ${msg}`);

import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
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

async function loadQuotes(ddbDocClient, setQuotes) {
  function sortCompare(a, b) {
    return b.timestamp - a.timestamp;
  };
  await loadTable(ddbDocClient, setQuotes, "Quotes", sortCompare)
};

async function loadTable(ddbDocClient, setter: Function, tableName: string, sortCompare: (a: any, b: any) => number = null) {
  log(`loadTable("${tableName}")`)
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
  if (sortCompare) {
    acc.sort(sortCompare);
  } else {
    acc.sort((a, b) => a.name.localeCompare(b.name));
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
  const [loadsComplete, setFetchesComplete] = useState<boolean>(false);
  const [materials, setMaterials] = useState<Array<IMaterial>>([]);
  const [metals, setMetals] = useState<Array<IMetal>>([]);
  const [metalFamilies, setMetalFamilies] = useState<Array<IMetalFamily>>([]);
  const [standardSetups, setStandardSetups] = useState<Array<IStandardSetup>>([]);
  const [inHouses, setInHouses] = useState<Array<IInHouse>>([]);
  const [outsourcings, setOutsourcings] = useState<Array<IOutsourcing>>([]);
  const [items, setItems] = useState<Array<IItem>>([]);
  const [quotes, setQuotes] = useState<Array<IQuote>>([]);

  const auth = useAuth();

  const client = new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: getAwsCreds(auth),
  });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  useEffect(() => {
    Promise.all([
      loadMetalFamilies(ddbDocClient, setMetalFamilies),
      loadMetals(ddbDocClient, setMetals),
      loadMaterials(ddbDocClient, setMaterials),
      loadStandardSetups(ddbDocClient, setStandardSetups),
      loadInHouses(ddbDocClient, setInHouses),
      loadOutsourcings(ddbDocClient, setOutsourcings),
      loadItems(ddbDocClient, setItems),
      loadQuotes(ddbDocClient, setQuotes),
    ]).then(() => setFetchesComplete(true));
  }, [])

  async function saveMetalFamily(metalFamily: IMetalFamily) {
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

  async function saveMetal(metal: IMetal) {
    log("saveMetal() " + metal.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Metals",
      Item: metal,
    }));
    log(response);
    loadMetals(ddbDocClient, setMetals)
  }

  async function saveMaterial(material: IMaterial) {
    log("saveMaterial() " + material.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Materials",
      Item: material,
    }));
    log(response);
    loadMaterials(ddbDocClient, setMaterials)
  }

  async function saveStandardSetup(standardSetup: IStandardSetup) {
    log("saveStandardSetup() " + standardSetup.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "StandardSetups",
      Item: standardSetup,
    }));
    log(response);
    loadStandardSetups(ddbDocClient, setStandardSetups);
  }

  async function saveInHouse(inHouse: IInHouse) {
    log("saveInHouse() " + inHouse.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "InHouses",
      Item: inHouse,
    }));
    log(response);
    loadInHouses(ddbDocClient, setInHouses);
  }

  async function saveOutsourcing(outsourcing: IOutsourcing) {
    log("saveOutsourcing() " + outsourcing.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Outsourcings",
      Item: outsourcing,
    }));
    log(response);
    loadOutsourcings(ddbDocClient, setOutsourcings);
  }

  async function saveItem(item: IItem) {
    log("saveItem() " + item.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Items",
      Item: item,
    }));
    log(JSON.stringify(response));
    loadItems(ddbDocClient, setItems);
  }

  async function saveQuote(quote: IQuote) {
    log(`saveQuote() ${quote.name} - ${quote.timestamp}`);
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Quotes",
      Item: quote,
    }));
    log(response);
    loadQuotes(ddbDocClient, setQuotes);
  }

  if (!loadsComplete) {
    return <h1>載入中 Loading...</h1>
  }

  function tabTitle(label) {
    return `${label.chinese} ${label.plural}`;
  }

  return (<>
    <Tabs
      defaultActiveKey="quotes"
    >
      <Tab eventKey="quotes" title={tabTitle(Labels.quote)}>
        <Quotes
          quotes={quotes}
          items={items}
          materials={materials}
          metals={metals}
          inHouses={inHouses}
          outsourcings={outsourcings}
          saveQuote={saveQuote}
        />
      </Tab>
      <Tab eventKey="items" title={tabTitle(Labels.item)}>
        <Items
          items={items}
          materials={materials}
          metals={metals}
          standardSetups={standardSetups}
          inHouses={inHouses}
          outsourcings={outsourcings}
          saveItem={saveItem}
        />
      </Tab>
      <Tab eventKey="materials" title={tabTitle(Labels.material)}>
        <Materials
          materials={materials}
          metals={metals}
          saveMaterial={saveMaterial}
        />
      </Tab>
      <Tab eventKey="metals" title={tabTitle(Labels.metal)}>
        <Metals
          metals={metals}
          metalFamilies={metalFamilies}
          saveMetal={saveMetal}
        />
      </Tab>
      <Tab eventKey="metalFamilies" title={tabTitle(Labels.metalFamily)}>
        <MetalFamilies
          metalFamilies={metalFamilies}
          saveMetalFamily={saveMetalFamily}
        />
      </Tab>
      <Tab eventKey="inHouses" title={tabTitle(Labels.inHouse)}>
        <InHouses
          inHouses={inHouses}
          saveInHouse={saveInHouse}
        />
      </Tab>
      <Tab eventKey="outsourcings" title={tabTitle(Labels.outsourcing)}>
        <Outsourcings
          outsourcings={outsourcings}
          saveOutsourcing={saveOutsourcing}
        />
      </Tab>
      <Tab eventKey="standardSetups" title={tabTitle(Labels.standardSetup)}>
        <StandardSetups
          standardSetups={standardSetups}
          saveStandardSetup={saveStandardSetup}
        />
      </Tab>
    </Tabs>
  </>);
}

export default MyTabs;
