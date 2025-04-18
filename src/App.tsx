import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import MyTabs from './MyTabs.tsx';

import { useAuth } from "react-oidc-context";

import 'react-tabs/style/react-tabs.css';

function App() {

  const auth = useAuth();

/*
  const signOutRedirect = () => {
    const clientId = "6dmaip976mpqdf8tjs0q6n15qj";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };
*/

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <main>
        <MyTabs />
      </main>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => void auth.removeUser()}>Log out</button>
    </div>
  );
}

export default App;
