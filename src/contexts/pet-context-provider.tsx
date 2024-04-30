'use client';

import { addPet, deletePet, editPet } from '@/actions/actions';
import { PetEssential } from '@/lib/types';
import { Pet } from '@prisma/client';
import { createContext, useContext, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet['id'] | null;
  selectedPet?: Pet;
  numberOfPets: number;
  handleSelectedPetIdChange: (id: Pet['id']) => void;
  handleCheckoutPet: (id: Pet['id']) => Promise<void>;
  handleAddPet: (newPet: PetEssential) => Promise<void>;
  handleEditPet: (petId: Pet['id'], newPetData: PetEssential) => Promise<void>;
};

const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({ children, data }: PetContextProviderProps) {
  const [optimisticPets, setOptimisticPets] = useOptimistic(data, (state, { action, payload }) => {
    switch (action) {
      case 'add':
        return [...state, { ...payload, id: 'temp-id' }];
      case 'edit':
        return state.map((pet) => {
          if (pet.id === payload.id) {
            return { ...pet, ...payload.newPetData };
          }
          return pet;
        });
      case 'delete':
        return state.filter((pet) => pet.id !== payload);
      default:
        return state;
    }
  });
  const [selectedPetId, setSelectedPetId] = useState<Pet['id'] | null>(null);

  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  const handleAddPet = async (newPet: PetEssential) => {
    setOptimisticPets({ action: 'add', payload: newPet });

    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet['id'], newPetData: PetEssential) => {
    setOptimisticPets({ action: 'edit', payload: { id: petId, newPetData } });

    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: Pet['id']) => {
    setOptimisticPets({ action: 'delete', payload: petId });
    setSelectedPetId(null);

    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleSelectedPetIdChange = (id: Pet['id']) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPet,
        selectedPetId,
        numberOfPets,
        handleSelectedPetIdChange,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
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
