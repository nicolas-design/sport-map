import { insertRating } from '../../../util/database';

export default async function spotRating(req, res) {
  if (req.method === 'POST') {
    console.log('Post');
    const rating = await insertRating(req.body.id, req.body.userRating);
    return res.status(200).json({ rating: rating });
  }
  res.status(400).json(null);
}
