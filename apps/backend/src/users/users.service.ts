  // ...existing code...
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import { GoogleUserInfo } from './dto/google-auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    console.log('🔍 Looking up user by email:', email);
    try {
      const user = await this.userModel.findOne({ email }).exec();
      console.log('🔍 User lookup result:', {
        found: !!user,
        email: user?.email,
        hasPassword: !!user?.password,
        passwordPrefix: user?.password?.substring(0, 10) + '...'
      });
      return user;
    } catch (error) {
      console.error('🔍 Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createUser(
    googleUserInfo: GoogleUserInfo
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

    // Removed personalNumber and phoneNumber checks

    const now = new Date();
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14); // 14 დღე
    const user = new this.userModel({
      name: googleUserInfo.name,
      email: googleUserInfo.email,
      googleId: googleUserInfo.sub,
      picture: googleUserInfo.picture || undefined,
      authProvider: 'google',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isEmailVerified: googleUserInfo.email_verified,
      lastLoginAt: now,
      subscriptionStatus: 'active',
      subscriptionStartDate: now,
      subscriptionEndDate: end,
      subscriptionDays: 14,
    });

    return user.save();
  }

  async createEmailUser(userData: {
    email: string;
    name: string;
    password: string;
    organization?: string;
    position?: string;
    emailVerificationToken?: string;
    emailVerificationTokenExpires?: Date;
  }): Promise<UserDocument> {
    try {
      console.log('≡ƒöº Creating email user - Starting validation...');
      
      // Check if email is already taken
      const existingEmail = await this.findByEmail(userData.email);
      if (existingEmail) {
        console.log('❌ Email already exists:', userData.email);
        throw new ConflictException('Email already registered');
      }
      console.log('✅ Email is available');

      // Removed personalNumber and phoneNumber checks

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      console.log('🔒 Password hashed');

      console.log('🔧 Creating new user document...');
      const now = new Date();
      const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14); // 14 დღე
      const user = new this.userModel({
        name: userData.name,
        email: userData.email,
        // googleId is omitted for email users to avoid unique constraint issues
        picture: null,
        password: hashedPassword, // Now properly hashed
        organization: userData.organization,
        position: userData.position,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false, // TODO: implement email verification
        lastLoginAt: now,
        authProvider: 'email',
        emailVerificationToken: userData.emailVerificationToken,
        emailVerificationTokenExpires: userData.emailVerificationTokenExpires,
        subscriptionStatus: 'active',
        subscriptionStartDate: now,
        subscriptionEndDate: end,
        subscriptionDays: 14,
      });

      console.log('≡ƒöº Saving user to database...');
      const savedUser = await user.save();
      console.log('≡ƒöº User saved successfully with ID:', savedUser._id);
      
      return savedUser;
    } catch (error) {
      console.error('≡ƒöº Error creating email user:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        userData: {
          email: userData.email,
          name: userData.name,
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

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<void> {
    console.log('🔒 Updating password hash for user:', userId);
    await this.userModel.findByIdAndUpdate(userId, {
      password: newPasswordHash,
    });
    console.log('🔒 Password hash updated successfully');
  }

  async linkGoogleId(userId: string, googleId: string): Promise<void> {
    console.log('🔗 Linking Google ID to existing user:', userId);
    await this.userModel.findByIdAndUpdate(userId, {
      googleId: googleId,
      authProvider: 'google',
    });
    console.log('🔗 Google ID linked successfully with authProvider set to google');
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

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteAllUsers(): Promise<void> {
    await this.userModel.deleteMany({}).exec();
  }
  async findByVerificationToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailVerificationToken: token }).exec();
  }
}