import React, { createContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const YourCollectionsContext = createContext();

export function YourCollectionsProvider({ children }) {
  const [yourCollections, setYourCollections] = useState([]);
  const { fetchYourCollectionsAsync } = useFetch();

  useEffect(() => {
    fetchYourCollectionsAsync(setYourCollections);
  }, []);

  return (
    <YourCollectionsContext.Provider value={{ yourCollections, setYourCollections }}>
      {children}
    </YourCollectionsContext.Provider>
  );
}

export default YourCollectionsContext;
