import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client';

import { SignInButton } from '.';

jest.mock('next-auth/client');
const useSessionMocked = mocked(useSession);

describe('SigninButton', () => {
  it('renders correctly when user is not logged in', () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    const { debug } = render(<SignInButton />);
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('renders correctly when user is logged in', () => {
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'John doe', email: 'john@example.com' },
        expires: 'fake-expires',
      },
      true,
    ]);

    const { debug } = render(<SignInButton />);
    expect(screen.getByText('John doe')).toBeInTheDocument();
  });
});
