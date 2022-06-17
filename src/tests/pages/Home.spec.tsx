import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [false, null],
  };
});
jest.mock('../../services/stripe');

describe('Home', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: '1', amount: 'R$10,00' }} />);

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrieveStripeMocked = mocked(stripe.prices.retrieve);

    retrieveStripeMocked.mockResolvedValueOnce({
      id: '1',
      unit_amount: 1000,
    } as any);

    const result = await getStaticProps({});
    expect(result).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: '1',
            amount: '$10.00',
          },
        },
        //revalidate: 86400,
      })
    );
    expect(result).toMatchObject({
      props: {
        product: {
          priceId: '1',
          amount: '$10.00',
        },
      },
      //revalidate: 86400,
    });
    expect(result).toStrictEqual({
      props: {
        product: {
          priceId: '1',
          amount: '$10.00',
        },
      },
      revalidate: 86400,
    });
  });
});
