'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import { sleep } from '@/lib/utils';
import { authSchema, petFormSchema, petIdSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { checkAuth, getPetById } from '@/lib/server-utils';

// --- user actions ---
export async function logIn(formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data',
    };
  }
  await signIn('credentials', formData);
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

export async function signUp(formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data',
    };
  }

  const validatedFormData = authSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFormData.success) {
    return {
      message: 'Invalid form data',
    };
  }
  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });

  await signIn('credentials', formData);
}

// --- pet actions

export async function addPet(petData: unknown) {
  await sleep(1000);

  const session = await checkAuth();
  const validatedPetData = petFormSchema.safeParse(petData);
  if (!validatedPetData.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPetData.data,
        user: {
          connect: { id: session.user.id },
        },
      },
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

  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPetData = petFormSchema.safeParse(petData);

  if (!validatedPetData.success || !validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Unauthorized',
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

  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: 'Invalid pet data',
    };
  }

  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: 'Pet not found',
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: 'Unauthorized',
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
