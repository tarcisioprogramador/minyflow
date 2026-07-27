import { Controller, Get, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('profile')
  @ApiOperation({ summary: 'Atualizar perfil' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Alterar senha' })
  updatePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.updatePassword(userId, body.currentPassword, body.newPassword);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Obter estatísticas de uso' })
  getUsage(@CurrentUser('id') userId: string) {
    return this.usersService.getUsageStats(userId);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Excluir conta' })
  deleteAccount(
    @CurrentUser('id') userId: string,
    @Body() body: { password: string },
  ) {
    return this.usersService.deleteAccount(userId, body.password);
  }
}
