import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import AuthContext from "./AuthProvider";

const YourCollectionsContext = createContext();

export function YourCollectionsProvider({ children }) {
  const [yourCollections, setYourCollections] = useState([]);
  const { fetchYourCollectionsAsync } = useFetch();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.accessToken) {
      fetchYourCollectionsAsync(setYourCollections);
    }
  }, [auth]);

  return (
    <YourCollectionsContext.Provider value={{ yourCollections, setYourCollections }}>
      {children}
    </YourCollectionsContext.Provider>
  );
}

export default YourCollectionsContext;
