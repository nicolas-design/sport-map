import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValue } from '../../../util/context';
import {
  deleteInfoById,
  getInfoById,
  updateInfoById,
} from '../../../util/database';

export default async function singleUserHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('HTTP Method (aka verb)', req.method);

  const infoId = convertQueryValue(req.query.spotId);

  if (req.method === 'GET') {
    const spot = await getInfoById(infoId);
    return res.status(200).json({ spot: spot || null });
  } else if (req.method === 'PUT') {
    const spot = await updateInfoById(
      infoId,
      req.body.addressInt,
      req.body.city,
      req.body.sportType,
      req.body.spotDescription,
    );
    return res.status(200).json({ spot: spot || null });
  } else if (req.method === 'DELETE') {
    const spot = await deleteInfoById(infoId);
    return res.status(200).json({ spot: spot || null });
  }

  res.status(400).json(null);
}
