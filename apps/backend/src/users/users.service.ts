import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from '../models/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('მომხმარებელი უკვე არსებობს');
    }

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<IUser[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new Error('ელ-ფოსტა უკვე გამოყენებულია');
      }
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('მომხმარებელი ვერ მოიძებნა');
    }
  }
} 