import { Controller, Post, Body, Get, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sessions')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserSessions(@Req() req: Request) {
        const userId = req.user['sub'];
        return this.sessionService.getUserSessions(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':sessionId')
    async deleteSession(@Param('sessionId') sessionId: string, @Req() req: Request) {
        const userId = req.user['sub'];
        await this.sessionService.deleteSession(sessionId);
        return { message: 'Session deleted successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteAllSessions(@Req() req: Request) {
        const userId = req.user['sub'];
        await this.sessionService.deleteAllUserSessions(userId);
        return { message: 'All sessions deleted successfully' };
    }
} 