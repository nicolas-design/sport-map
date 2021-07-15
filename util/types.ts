export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};
export type Info = {
  id: number;
  addressInt: string;
  city: string;
  sportType: string;
  spotDescription: string;
  coordinates: string;
  usernameOwner: string;
  userRating: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export type Session = {
  id: number;
  token: string;
  expiry: Date;
  userId: number;
};

export type ApplicationError = { message: string };

export type Rating = {
  id: string;
  userRating: string;
};
