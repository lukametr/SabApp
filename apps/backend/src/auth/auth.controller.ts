import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'მომხმარებლის ავტორიზაცია' })
  @ApiResponse({ status: 200, description: 'წარმატებული ავტორიზაცია' })
  @ApiResponse({ status: 401, description: 'არაავტორიზებული' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'ახალი მომხმარებლის რეგისტრაცია' })
  @ApiResponse({ status: 201, description: 'მომხმარებელი წარმატებით დარეგისტრირდა' })
  @ApiResponse({ status: 400, description: 'არასწორი მონაცემები' })
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'მომხმარებლის პროფილის მიღება' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  @ApiResponse({ status: 401, description: 'არაავტორიზებული' })
  getProfile(@Request() req) {
    return req.user;
  }
} 