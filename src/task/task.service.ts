import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TodoDto } from 'src/farm/dto';

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
          farm: {
            connect: {
              id: dto.farmId,
            },
          },
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
      const tasks = await this.prisma.task.findMany({
        include: {
          todo: true,
        },
      });

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
        include: {
          todo: true,
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

  async addTodo(taskid: string, dto: TodoDto) {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          task: {
            connect: {
              id: taskid,
            },
          },
          message: dto.message,
          complete: dto.complete,
        },
      });

      if (!todo) {
        throw new InternalServerErrorException('Todo could not be created');
      }

      return {
        message: 'Todo created successfully',
        status: 'success',
        statusCode: 200,
        data: todo,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Todo could not be created');
    }
  }

  async updateTodo(todoid: string, dto: TodoDto) {
    try {
      const todo = await this.prisma.todo.update({
        where: {
          id: todoid,
        },
        data: dto,
      });

      if (!todo) {
        throw new InternalServerErrorException('Todo could not be updated.');
      }

      return {
        message: 'Todo has been updated successfully',
        status: 'success',
        statusCode: 200,
        data: todo,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Todo could not be updated');
    }
  }

  async deleteTodo(todoid: string) {
    try {
      await this.prisma.todo.delete({
        where: {
          id: todoid,
        },
      });

      return {
        message: 'Todo deleted successfully',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Todo could not be deleted');
    }
  }

  async deleteTask(taskid: string) {
    try {
      const task = await this.prisma.task.delete({
        where: {
          id: taskid,
        },
      });

      if (!task) {
        throw new InternalServerErrorException('Task could not be deleted');
      }

      return {
        message: 'Task deleted successfully.',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
