import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Post()
    create(@Request() req, @Body() dto: CreateTaskDto) {
        return this.tasksService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAllForUser(req.user.userId, req.user.role);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.tasksService.findOne(+id, req.user.userId, req.user.role);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(+id, req.user.userId, req.user.role, dto);
    }

    @Delete(':id')
    delete(@Request() req, @Param('id') id: string) {
        return this.tasksService.delete(+id, req.user.userId, req.user.role);
    }

    // Admin only: получить всех пользователей
    @Get('admin/users')
    @Roles('ADMIN')
    async getAllUsers(@Request() req) {
        // этот метод можно вынести в отдельный UsersController
        const { PrismaService } = require('../prisma/prisma.service');
        const prisma = new PrismaService();
        return prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
    }
}