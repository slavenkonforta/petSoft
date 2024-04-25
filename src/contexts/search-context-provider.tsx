'use client';

import { createContext, useContext, useState } from 'react';

type SearchContextProviderProps = {
  children: React.ReactNode;
};

type TSearchContext = {
  searchText: string;
  handleSearchTextChange: (text: string) => void;
};

const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({ children }: SearchContextProviderProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <SearchContext.Provider
      value={{
        searchText,
        handleSearchTextChange,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchContextProvider');
  }
  return context;
};
