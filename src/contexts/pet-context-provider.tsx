'use client';

import { Pet } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleSelectedPetIdChange: (id: string) => void;
};

const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({ children, data }: PetContextProviderProps) {
  const [pets, setPets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const handleSelectedPetIdChange = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider value={{ pets, selectedPetId, handleSelectedPetIdChange }}>
      {children}
    </PetContext.Provider>
  );
}

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePetContext must be used within a PetContextProvider');
  }
  return context;
};
