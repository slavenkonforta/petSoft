'use client';

import { usePetContext } from '@/contexts/pet-context-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function PetList() {
  const { pets, selectedPetId, handleSelectedPetIdChange } = usePetContext();

  return (
    <ul className='border-b border-black/[0.08] bg-white'>
      {pets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleSelectedPetIdChange(pet.id)}
            className={cn(
              `flex h-[70px] w-full cursor-pointer items-center gap-3 px-5 text-base 
              transition hover:bg-[#EFF1F2] focus:bg-[#EFF1F2]`,
              {
                'bg-[#EFF1F2]': pet.id === selectedPetId,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt='Pet image'
              width={45}
              height={45}
              className='h-[45px] w-[45px] rounded-full object-cover'
            />
            <p className='font-semibold'>{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
