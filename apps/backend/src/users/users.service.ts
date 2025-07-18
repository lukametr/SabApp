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
    // Input validation
    if (!googleId) {
      console.log('❌ findByGoogleId called with empty googleId');
      return null;
    }
    
    // Clean and validate the Google ID
    const cleanGoogleId = String(googleId).trim();
    if (!cleanGoogleId) {
      console.log('❌ Invalid Google ID after cleaning');
      return null;
    }
    
    console.log('🔍 Looking up user by Google ID:', cleanGoogleId);
    
    try {
      // Use lean() for better performance, then convert to document if found
      const userLean = await this.userModel
        .findOne({ googleId: cleanGoogleId })
        .lean()
        .exec();
      
      if (userLean) {
        console.log('✅ User found by Google ID:', userLean.email);
        // Convert back to full document
        const userDoc = await this.userModel.findById(userLean._id).exec();
        return userDoc;
      } else {
        console.log('❌ No user found with Google ID:', cleanGoogleId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error in findByGoogleId:', error);
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
    console.log('🆕 Creating new Google user:', googleUserInfo.email);
    
    // Validate input
    if (!googleUserInfo.email || !googleUserInfo.sub) {
      console.error('❌ Invalid Google user info:', googleUserInfo);
      throw new ConflictException('Invalid Google user info: email and sub are required');
    }
    
    // Clean the Google ID
    const cleanGoogleId = String(googleUserInfo.sub).trim();
    const cleanEmail = googleUserInfo.email.toLowerCase().trim();
    
    if (!cleanGoogleId || !cleanEmail) {
      throw new ConflictException('Invalid Google credentials');
    }
    
    // Double-check user doesn't exist (race condition protection)
    const existingByGoogleId = await this.findByGoogleId(cleanGoogleId);
    if (existingByGoogleId) {
      console.log('⚠️ User already exists with this Google ID');
      return existingByGoogleId;
    }
    
    const existingByEmail = await this.findByEmail(cleanEmail);
    if (existingByEmail) {
      if (existingByEmail.googleId) {
        console.log('⚠️ User already exists with this email and has Google ID');
        return existingByEmail;
      } else {
        console.log('🔗 Linking Google ID to existing email user');
        await this.linkGoogleId(String(existingByEmail._id), cleanGoogleId);
        const updatedUser = await this.findById(String(existingByEmail._id));
        return updatedUser as UserDocument;
      }
    }
    
    // Create new user
    const now = new Date();
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14); // 14 დღე
    
    const userToCreate = {
      name: googleUserInfo.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      googleId: cleanGoogleId,
      picture: googleUserInfo.picture || undefined,
      authProvider: 'google',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isEmailVerified: true, // Google users are always verified
      lastLoginAt: now,
      subscriptionStatus: 'active',
      subscriptionStartDate: now,
      subscriptionEndDate: end,
      subscriptionDays: 14,
    };

    console.log('💾 Creating new user document...');
    const userDoc = new this.userModel(userToCreate);
    
    try {
      const savedUser = await userDoc.save();
      console.log('✅ New Google user created successfully:', savedUser._id);
      
      // Verify save was successful
      const verifyUser = await this.userModel.findById(savedUser._id).exec();
      if (!verifyUser) {
        throw new Error('User save verification failed');
      }
      
      return savedUser;
    } catch (error) {
      // Handle duplicate key errors gracefully
      if (error.code === 11000) {
        console.log('⚠️ Duplicate key error detected, trying to find existing user');
        
        // Check if it's a googleId duplicate
        if (error.message.includes('googleId')) {
          const existing = await this.findByGoogleId(cleanGoogleId);
          if (existing) {
            console.log('✅ Found existing user by Google ID');
            return existing;
          }
        }
        
        // Check if it's an email duplicate
        if (error.message.includes('email')) {
          const existing = await this.findByEmail(cleanEmail);
          if (existing) {
            console.log('✅ Found existing user by email');
            if (!existing.googleId) {
              await this.linkGoogleId(String(existing._id), cleanGoogleId);
              return await this.findById(String(existing._id)) as UserDocument;
            }
            return existing;
          }
        }
      }
      
      console.error('❌ Error creating user:', error);
      throw error;
    }
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