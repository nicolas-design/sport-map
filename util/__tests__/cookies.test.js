import { getLocationValue } from '../cookies';

test('get Location if no location has been set', () => {
  expect(getLocationValue()).toStrictEqual([]);
});
