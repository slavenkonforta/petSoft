'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import PetForm from './pet-form';
import { useState } from 'react';
import { flushSync } from 'react-dom';

type PetButtonProps = {
  children?: React.ReactNode;
  actionType: 'add' | 'edit' | 'checkout';
  disabled?: boolean;
  onClick?: () => void;
};

export default function PetButton({ children, actionType, onClick, disabled }: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === 'checkout') {
    return (
      <Button disabled={disabled} onClick={onClick} variant='secondary'>
        {children}
      </Button>
    );
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        {actionType === 'add' ? (
          <Button size='icon'>
            <PlusIcon className='size-6' />
          </Button>
        ) : (
          <Button variant='secondary'>{children}</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionType === 'add' ? 'Add a new pet' : 'Edit pet'}</DialogTitle>
        </DialogHeader>

        <PetForm
          actionType={actionType}
          onFormSubmit={() => {
            flushSync(() => {
              setIsFormOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
