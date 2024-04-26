'use server';

import prisma from '@/lib/db';
import { Pet } from '@/lib/types';
import { sleep } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function addPet(petData: Omit<Pet, 'id'>) {
  await sleep(2000);

  try {
    await prisma.pet.create({
      data: petData,
    });
  } catch (error) {
    return {
      message: 'Failed to add pet',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: string, petData: Omit<Pet, 'id'>) {
  await sleep(2000);

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: petData,
    });
  } catch (error) {
    return {
      message: 'Failed to edit pet',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: string) {
  await sleep(2000);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: 'Failed to delete pet',
    };
  }

  revalidatePath('/app', 'layout');
}
