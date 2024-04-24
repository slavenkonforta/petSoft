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
  selectedPet?: Pet;
  numberOfPets: number;
};

const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({ children, data }: PetContextProviderProps) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  const handleSelectedPetIdChange = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPet,
        selectedPetId,
        handleSelectedPetIdChange,
        numberOfPets,
      }}
    >
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
