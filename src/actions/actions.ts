'use server';

import prisma from '@/lib/db';
import { PetEssential } from '@/lib/types';
import { sleep } from '@/lib/utils';
import { Pet } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addPet(petData: PetEssential) {
  await sleep(1000);

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

export async function editPet(petId: Pet['id'], petData: PetEssential) {
  await sleep(1000);

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

export async function deletePet(petId: Pet['id']) {
  await sleep(1000);

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
