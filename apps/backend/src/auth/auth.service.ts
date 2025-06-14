import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUser } from '../models/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.comparePassword(password)) {
      return user;
    }
    return null;
  }

  async login(user: IUser): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
  }
} 