import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  static collectionName = 'users'

  static createUser(email: string, hashedPassword: string): Omit<User, '_id'> {
    return {
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  static toUserDocument(user: Partial<User>): User {
    return {
      _id: user._id || new ObjectId(),
      email: user.email || '',
      password: user.password || '',
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    }
  }
}