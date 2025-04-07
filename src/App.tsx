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

import { useAuth } from "react-oidc-context";

function App() {

  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "6dmaip976mpqdf8tjs0q6n15qj";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <main>
        <p>Hello {JSON.stringify(auth.user.profile.email)}{" "}</p>
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

    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
      <button onClick={() => void auth.removeUser()}>Log out</button>
    </div>
    </main>
  );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
      <button onClick={() => void auth.removeUser()}>Log out</button>
    </div>
  );
}

export default App;
