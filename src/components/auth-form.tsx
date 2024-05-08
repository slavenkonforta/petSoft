import { logIn, signUp } from '@/actions/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type AuthFormProps = { type: 'logIn' | 'signUp' };

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={type === 'logIn' ? logIn : signUp}>
      <div className='space-y-1'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' name='email' type='email' required />
      </div>
      <div className='mb-4 mt-2 space-y-1'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' name='password' type='password' required />
      </div>

      <Button>{type === 'signUp' ? 'Sign Up' : 'Log In'}</Button>
    </form>
  );
}