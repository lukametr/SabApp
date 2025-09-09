import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended', // For subscription expired
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  picture?: string;

  @Prop()
  password?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop()
  organization?: string;

  @Prop()
  position?: string;

  @Prop({ default: 'email' })
  authProvider?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationTokenExpires?: Date;

  // Subscription fields
  @Prop({
    type: String,
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  subscriptionStatus: SubscriptionStatus;

  @Prop()
  subscriptionStartDate?: Date;

  @Prop()
  subscriptionEndDate?: Date;

  @Prop({ default: 0 })
  subscriptionDays: number; // How many days of subscription granted

  @Prop()
  lastPaymentDate?: Date;

  @Prop({ default: 0 })
  paymentAmount?: number; // Amount paid in GEL

  @Prop()
  paymentNote?: string; // Admin note about payment

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
