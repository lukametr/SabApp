  // ...existing code...
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Removed Google-specific lookups and links

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


  // Removed Google user creation

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
      if (!userData.password || userData.password.length < 4) {
        throw new Error('Invalid password for hashing');
      }
      console.log('🔒 Password hashing starting...', { inputLength: userData.password.length });
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      console.log('🔒 Password hashed', { hashPrefix: hashedPassword.substring(0, 7), length: hashedPassword.length });

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

  // Removed Google linking

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-__v').exec();
  }

  async debugAllUsers(): Promise<void> {
    console.log('🔍 DEBUG: All users in database:');
    const users = await this.userModel.find().select('email authProvider name').exec();
    users.forEach((user, index) => {
      console.log(`🔍 User ${index + 1}:`, {
        id: user._id,
        email: user.email,
        authProvider: user.authProvider,
        name: user.name,
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

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserDocument> {
    // Normalize inputs and avoid saving empty strings/nulls into unique/sparse indexed fields
    const setData: Record<string, any> = {};
    const unsetData: Record<string, ''> = {};

    const handleField = (key: keyof UpdateProfileDto, value: any) => {
      if (value === undefined) return; // not provided
      if (value === null) {
        unsetData[String(key)] = '';
        return;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') {
          unsetData[String(key)] = '';
        } else {
          setData[String(key)] = trimmed;
        }
        return;
      }
      setData[String(key)] = value;
    };

    handleField('name', data.name);
    handleField('organization', data.organization);
    handleField('position', data.position);
    handleField('phoneNumber', data.phoneNumber);
    handleField('picture', data.picture as any);

    const updateOps: any = {};
    if (Object.keys(setData).length) updateOps.$set = setData;
    if (Object.keys(unsetData).length) updateOps.$unset = unsetData;

    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, updateOps, { new: true, runValidators: true })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      console.log('✅ Profile updated successfully:', {
        userId: user._id,
        phoneNumber: user.phoneNumber,
        organization: user.organization,
        position: user.position,
      });

      return user;
    } catch (err: any) {
      // Handle duplicate key errors gracefully (e.g., phoneNumber unique index)
      if (err?.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || 'field';
        throw new ConflictException(`${field} already exists`);
      }
      throw err;
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, { $set: { password: hashedPassword } }, { new: true })
        .exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      console.log('✅ Password updated successfully for user:', userId);
    } catch (error) {
      console.error('❌ Error updating password:', error);
      throw error;
    }
  }
}