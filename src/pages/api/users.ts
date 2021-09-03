import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Elves' },
    { id: 2, name: 'Acsa' },
    { id: 3, name: 'Yasmim' },
  ];

  return response.json(users);
};
