import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserRole,
  UserStatus,
} from './schemas/user.schema';
import { GoogleUserInfo } from './dto/google-auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createUser(
    googleUserInfo: GoogleUserInfo,
    personalNumber: string,
    phoneNumber: string,
  ): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.findByGoogleId(googleUserInfo.sub);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Check if email is already taken
    const existingEmail = await this.findByEmail(googleUserInfo.email);
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if personal number is already taken
    const existingPersonalNumber = await this.userModel
      .findOne({ personalNumber })
      .exec();
    if (existingPersonalNumber) {
      throw new ConflictException('Personal number already registered');
    }

    // Check if phone number is already taken
    const existingPhoneNumber = await this.userModel
      .findOne({ phoneNumber })
      .exec();
    if (existingPhoneNumber) {
      throw new ConflictException('Phone number already registered');
    }

    const user = new this.userModel({
      name: googleUserInfo.name,
      email: googleUserInfo.email,
      googleId: googleUserInfo.sub,
      picture: googleUserInfo.picture,
      personalNumber,
      phoneNumber,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isEmailVerified: googleUserInfo.email_verified,
      lastLoginAt: new Date(),
    });

    return user.save();
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLoginAt: new Date(),
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-__v').exec();
  }

  async updateUserStatus(
    userId: string,
    status: UserStatus,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { status }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { role }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
