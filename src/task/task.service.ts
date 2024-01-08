import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async createTask(dto: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          farmId: dto.farmId,
          description: dto.description,
          status: dto.status,
          priority: dto.priority,
          due_date: dto.due_date,
        },
      });

      if (!newTask) {
        throw new InternalServerErrorException('Task could not be created.');
      }

      return {
        message: 'Task created successfully.',
        status: 'success',
        statusCode: 200,
        data: newTask,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Task could not be created.');
    }
  }

  async getAllTasks() {
    try {
      const tasks = this.prisma.task.findFirst();

      if (!tasks) {
        throw new InternalServerErrorException('Tasks could not be retrieved.');
      }

      return {
        message: 'Tasks retrieved successfully.',
        status: 'success',
        statusCode: 200,
        data: tasks,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Tasks could not be retrieved.');
    }
  }

  async getTaskById(taskid: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskid,
        },
      });

      if (!task) {
        throw new NotFoundException('Task could not be found.');
      }

      return {
        message: 'Task retrieved successfully.',
        status: 'success',
        statusCode: 200,
        data: task,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Task could not be retrieved.');
    }
  }

  async updateTask(taskid: string, dto: UpdateTaskDto) {
    try {
      const updateTask = await this.prisma.task.update({
        where: {
          id: taskid,
        },
        data: dto,
      });

      if (!updateTask) {
        throw new InternalServerErrorException('Task could not be updated.');
      }

      return {
        message: 'Task updated successfully.',
        status: 'success',
        statusCode: 200,
        data: updateTask,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Task could not be updated.');
    }
  }

  async deleteTask(taskid: string) {
    try {
      await this.prisma.task.delete({
        where: {
          id: taskid,
        },
      });

      return {
        message: 'Task deleted successfully.',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Task could not be deleted.');
    }
  }
}
