import { convertQueryValue, convertQueryValueString } from '../context';

test('get Value of function', () => {
  expect(convertQueryValue(3)).toStrictEqual(3);
  expect(convertQueryValue('3')).toStrictEqual(3);
  expect(convertQueryValue([1, 2, 3, 4])).toStrictEqual(1);
});

test('get String of function', () => {
  expect(convertQueryValueString('test')).toStrictEqual('test');
  expect(convertQueryValueString(['test', '123'])).toStrictEqual('test');
});
