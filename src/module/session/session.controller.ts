import { Controller, Post, Body, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtUser } from 'src/common/decorators/user.decorator';

@ApiTags('Сессии')
@Controller('sessions')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Получение всех сессий пользователя' })
    async getUserSessions(@JwtUser('id') userId: string) {
        return this.sessionService.getUserSessions(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':sessionId')
    @ApiOperation({ summary: 'Удаление сессии' })
    async deleteSession(@Param('sessionId') sessionId: string) {
        await this.sessionService.deleteSession(sessionId); 
        return { message: 'Session deleted successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @ApiOperation({ summary: 'Удаление всех сессий пользователя' })
    async deleteAllSessions(@JwtUser('id') userId: string) {
        await this.sessionService.deleteAllUserSessions(userId);
        return { message: 'All sessions deleted successfully' };
    }
} 