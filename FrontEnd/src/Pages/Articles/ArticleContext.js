import React, { createContext, useContext, useState } from "react";

// Create a context
const ArticleContext = createContext();

// Create a provider component
export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);

  return (
    <ArticleContext.Provider value={{ articles, setArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};

// Custom hook to use the Article context
export const useArticles = () => {
  return useContext(ArticleContext);
};
