import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from '../models/User';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'ყველა მომხმარებლის მიღება' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'მომხმარებლის მიღება ID-ით' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  @ApiResponse({ status: 404, description: 'მომხმარებელი ვერ მოიძებნა' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'მომხმარებლის განახლება' })
  @ApiResponse({ status: 200, description: 'წარმატებული განახლება' })
  @ApiResponse({ status: 404, description: 'მომხმარებელი ვერ მოიძებნა' })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'მომხმარებლის წაშლა' })
  @ApiResponse({ status: 200, description: 'წარმატებული წაშლა' })
  @ApiResponse({ status: 404, description: 'მომხმარებელი ვერ მოიძებნა' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: IUser }): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }> {
    const user = await this.usersService.findOne(req.user._id.toString());
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: { user: IUser },
    @Body() updateUserDto: UpdateUserDto
  ): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }> {
    const user = await this.usersService.update(req.user._id.toString(), updateUserDto);
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }
} 