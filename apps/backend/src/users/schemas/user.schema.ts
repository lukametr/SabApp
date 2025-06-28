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
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop()
  picture?: string;

  @Prop({ required: true })
  personalNumber: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for better performance
UserSchema.index({ googleId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ personalNumber: 1 });
UserSchema.index({ phoneNumber: 1 }); 