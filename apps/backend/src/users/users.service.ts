import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import { GoogleUserInfo } from './dto/google-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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
    const existingPersonalNumber = await this.userModel.findOne({ personalNumber }).exec();
    if (existingPersonalNumber) {
      throw new ConflictException('Personal number already registered');
    }

    // Check if phone number is already taken
    const existingPhoneNumber = await this.userModel.findOne({ phoneNumber }).exec();
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

  async createEmailUser(userData: {
    email: string;
    name: string;
    personalNumber: string;
    phoneNumber: string;
    password: string;
    organization?: string;
    position?: string;
  }): Promise<UserDocument> {
    try {
      console.log('🔧 Creating email user - Starting validation...');
      
      // Check if email is already taken
      const existingEmail = await this.findByEmail(userData.email);
      if (existingEmail) {
        console.log('❌ Email already exists:', userData.email);
        throw new ConflictException('Email already registered');
      }
      console.log('✅ Email is available');

      // Check if personal number is already taken
      const existingPersonalNumber = await this.userModel.findOne({ personalNumber: userData.personalNumber }).exec();
      if (existingPersonalNumber) {
        console.log('❌ Personal number already exists:', userData.personalNumber);
        throw new ConflictException('Personal number already registered');
      }
      console.log('✅ Personal number is available');

      // Check if phone number is already taken
      const existingPhoneNumber = await this.userModel.findOne({ phoneNumber: userData.phoneNumber }).exec();
      if (existingPhoneNumber) {
        console.log('❌ Phone number already exists:', userData.phoneNumber);
        throw new ConflictException('Phone number already registered');
      }
      console.log('✅ Phone number is available');

      console.log('🔧 Creating new user document...');
      const user = new this.userModel({
        name: userData.name,
        email: userData.email,
        googleId: null, // Email/password user, no Google ID
        picture: null,
        personalNumber: userData.personalNumber,
        phoneNumber: userData.phoneNumber,
        password: userData.password, // Already hashed
        organization: userData.organization,
        position: userData.position,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false, // TODO: implement email verification
        lastLoginAt: new Date(),
        authProvider: 'email',
      });

      console.log('🔧 Saving user to database...');
      const savedUser = await user.save();
      console.log('✅ User saved successfully with ID:', savedUser._id);
      
      return savedUser;
    } catch (error) {
      console.error('❌ Error creating email user:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        userData: {
          email: userData.email,
          name: userData.name,
          personalNumber: userData.personalNumber,
          phoneNumber: userData.phoneNumber,
        }
      });
      throw error;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLoginAt: new Date(),
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-__v').exec();
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true },
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}