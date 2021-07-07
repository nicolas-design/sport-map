import { insertPlace } from '../../../util/database';

export default async function spotInfo(req, res) {
  if (req.method === 'POST') {
    console.log('Post');
    const spot = await insertPlace(
      req.body.addressInt,
      req.body.city,
      req.body.sportType,
      req.body.spotDescription,
      req.body.coordinates,
      req.body.usernameOwner,
    );
    return res.status(200).json({ spot: spot });
  }
  res.status(400).json(null);
}
