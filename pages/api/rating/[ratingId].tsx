import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../util/context';
import {
  deleteRatingById,
  getRatingById,
  updateRatingById,
} from '../../../util/database';

export default async function singleRatingHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('HTTP Method (aka verb)', req.method);

  const ratingId = convertQueryValueString(req.query.spotId);

  if (req.method === 'GET') {
    const rating = await getRatingById(ratingId);
    return res.status(200).json({ rating: rating || null });
  } else if (req.method === 'PUT') {
    const rating = await updateRatingById(req.body.id, req.body.userRating);
    return res.status(200).json({ rating: rating || null });
  } else if (req.method === 'DELETE') {
    const rating = await deleteRatingById(ratingId);
    return res.status(200).json({ rating: rating || null });
  }

  res.status(400).json(null);
}
