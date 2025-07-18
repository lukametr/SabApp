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
    console.log('Looking up user by Google ID:', googleId);
    console.log('Google ID type:', typeof googleId);
    
    try {
      const user = await this.userModel.findOne({ googleId }).exec();
      console.log('Google ID lookup result:', {
        found: !!user,
        email: user?.email,
        googleId: user?.googleId,
        authProvider: user?.authProvider
      });
      
      // Debug: Let's also try to find all Google users
      const allGoogleUsers = await this.userModel.find({ authProvider: 'google' }).exec();
      console.log('All Google users in DB:', allGoogleUsers.map(u => ({
        email: u.email,
        googleId: u.googleId,
        googleIdType: typeof u.googleId
      })));
      
      return user;
    } catch (error) {
      console.error('Error finding user by Google ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    console.log('🔍 Looking up user by email:', email);
    
    try {
      const user = await this.userModel.findOne({ email }).exec();
      console.log('🔍 User lookup result:', {
        found: !!user,
        email: user?.email,
        hasPassword: !!user?.password
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
    console.log('🔍 Creating user for:', googleUserInfo.email);
    
    // მკაცრი ვალიდაცია
    if (!googleUserInfo.email || !googleUserInfo.sub) {
      console.error('Google user info missing email or sub:', googleUserInfo);
      throw new ConflictException('Google account must have email and sub');
    }
    
    // Check if user already exists
    const existingUser = await this.findByGoogleId(googleUserInfo.sub);
    if (existingUser) {
      console.log('✅ User already exists, returning existing user');
      return existingUser;
    }
    
    // Check if email is already taken
    const existingEmail = await this.findByEmail(googleUserInfo.email);
    if (existingEmail) {
      console.log('� Email exists, linking Google ID to existing user');
      await this.linkGoogleId(String(existingEmail._id), googleUserInfo.sub);
      return await this.findById(String(existingEmail._id)) as UserDocument;
    }

    const now = new Date();
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14); // 14 დღე
    
    // 🔍 მონაცემები რომელსაც ვქმნით user object-ში
    const userToCreate = {
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
    };

    console.log('� Creating new user document...');
    const user = new this.userModel(userToCreate);
    const savedUser = await user.save();
    
    console.log('User saved with ID:', savedUser._id);
    console.log('User googleId after save:', savedUser.googleId);
    return savedUser;
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
    console.log('🔗 Linking Google ID to existing user:', userId, 'Google ID:', googleId);
    const result = await this.userModel.findByIdAndUpdate(userId, {
      googleId: googleId,
      authProvider: 'google',
    }, { new: true });
    console.log('🔗 Google ID linked successfully:', {
      userId: result?._id,
      email: result?.email,
      googleId: result?.googleId,
      authProvider: result?.authProvider
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-__v').exec();
  }

  async debugAllUsers(): Promise<void> {
    console.log('🔍 DEBUG: All users in database:');
    const users = await this.userModel.find().select('email googleId authProvider name').exec();
    users.forEach((user, index) => {
      console.log(`🔍 User ${index + 1}:`, {
        id: user._id,
        email: user.email,
        googleId: user.googleId,
        authProvider: user.authProvider,
        name: user.name
      });
    });
    console.log(`🔍 Total users: ${users.length}`);
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

  async verifyEmail(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationTokenExpires: undefined,
    });
    console.log('✅ Email verified for user:', userId);
  }
}