export type Gender =
  | "male"
  | "female"
  | "other";

export class User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  dob: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: string,
    name: string,
    email: string,
    gender: Gender,
    dob: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.dob = dob;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any): User {
    return new User(
      json.id,
      json.name,
      json.email,
      json.gender,
      json.dob,
      json.createdAt,
      json.updatedAt
    );
  }
}