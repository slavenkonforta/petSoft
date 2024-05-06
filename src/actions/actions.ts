'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

// --- user actions ---
export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  await signIn('credentials', authData);
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

// --- pet actions

export async function addPet(petData: unknown) {
  await sleep(1000);

  const validatedPetData = petFormSchema.safeParse(petData);
  if (!validatedPetData.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPetData.data,
    });
  } catch (error) {
    return {
      message: 'Failed to add pet',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function editPet(petId: unknown, petData: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPetData = petFormSchema.safeParse(petData);

  if (!validatedPetData.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPetData.data,
    });
  } catch (error) {
    return {
      message: 'Failed to edit pet',
    };
  }

  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: 'Failed to delete pet',
    };
  }

  revalidatePath('/app', 'layout');
}
