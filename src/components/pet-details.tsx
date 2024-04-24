'use client';

import { usePetContext } from '@/contexts/pet-context-provider';
import { Pet } from '@/lib/types';
import Image from 'next/image';

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className='flex h-full w-full flex-col'>
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />

          <OtherInfo pet={selectedPet} />

          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}

type PetProps = {
  pet: Pet;
};

function EmptyView() {
  return (
    <p className='flex h-full items-center justify-center text-2xl font-medium'>No pet selected</p>
  );
}

function TopBar({ pet }: PetProps) {
  return (
    <div className='border-light flex items-center border-b bg-white px-8 py-5'>
      <Image
        src={pet.imageUrl}
        alt='Selected pet image'
        height={75}
        width={75}
        className='h-[75px] w-[75px] rounded-full object-cover'
      />
      <h2 className='ml-5 text-3xl font-semibold leading-7'>{pet.name}</h2>
    </div>
  );
}

function OtherInfo({ pet }: PetProps) {
  return (
    <div className='flex justify-around px-5 py-10 text-center'>
      <div>
        <h3 className='text-[13px] font-medium uppercase text-zinc-700'>Owner name</h3>
        <p className='mt-1 text-lg text-zinc-800'>{pet.ownerName}</p>
      </div>
      <div>
        <h3 className='text-[13px] font-medium uppercase text-zinc-700'>Age</h3>
        <p className='mt-1 text-lg text-zinc-800'>{pet.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: PetProps) {
  return (
    <section className='border-light mx-8 mb-9 flex-1 rounded-md border bg-white px-7 py-5'>
      {pet.notes}
    </section>
  );
}
