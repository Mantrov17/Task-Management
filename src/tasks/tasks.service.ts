import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                completed: dto.completed ?? false,
                userId,
            },
        });
    }

    async findAllForUser(userId: number, role: string) {
        if (role === 'ADMIN') {
            return this.prisma.task.findMany({ include: { user: true } });
        }
        return this.prisma.task.findMany({ where: { userId } });
    }

    async findOne(id: number, userId: number, role: string) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');
        if (role !== 'ADMIN' && task.userId !== userId) {
            throw new ForbiddenException('You do not own this task');
        }
        return task;
    }

    async update(id: number, userId: number, role: string, dto: UpdateTaskDto) {
        await this.findOne(id, userId, role);
        return this.prisma.task.update({ where: { id }, data: dto });
    }

    async delete(id: number, userId: number, role: string) {
        await this.findOne(id, userId, role);
        return this.prisma.task.delete({ where: { id } });
    }
}