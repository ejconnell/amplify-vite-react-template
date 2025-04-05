import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Items from './Items.tsx';
import MetalFamilies from './MetalFamilies.tsx';
import Metals from './Metals.tsx';
import VolumePricing from './VolumePricing.tsx';
import InHouse from './InHouse.tsx';
import Outsourced from './Outsourced.tsx';
import StandardSetups from './StandardSetups.tsx';
import Todos from './Todos.js';

function App() {

  return (
    <main>
  <Tabs>
    <TabList>
      <Tab>Items</Tab>
      <Tab>Metal Families</Tab>
      <Tab>Metals</Tab>
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
      <MetalFamilies />
    </TabPanel>
    <TabPanel>
      <Metals />
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

    </main>
  );
}

export default App;
