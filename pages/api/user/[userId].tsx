import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../util/context';
import {
  deleteInfoByUsername,
  deleteUserByUsername,
  getFavoritesByUsername,
  updateUserById,
  updateUserByUsername,
} from '../../../util/database';

export default async function singleUserHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('HTTP Method (aka verb)', req.method);

  const userName = convertQueryValueString(req.query.userId);

  if (req.method === 'GET') {
    const user = await getFavoritesByUsername(userName);
    return res.status(200).json({ user: user || null });
  } else if (req.method === 'PUT') {
    const user = await updateUserByUsername(userName, req.body.favorites);
    return res.status(200).json({ user: user || null });
  } else if (req.method === 'DELETE') {
    const deleteSpots = await deleteInfoByUsername(userName);
    const spot = await deleteUserByUsername(userName);
    return res
      .status(200)
      .json({ spot: spot || null, spotdelete: deleteSpots || null });
  }

  res.status(400).json(null);
}
