import {
  Controller,
  Body,
  Post,
  Get,
  HttpCode,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { User } from 'src/decorators';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get()
  @HttpCode(200)
  getAllTasks(@User() user) {
    return this.taskService.getAllTasks(user.sub);
  }

  @Get('/:taskid')
  @HttpCode(200)
  getTaskById(@Param('taskid') taskid: string) {
    return this.taskService.getTaskById(taskid);
  }

  @Put('/:taskid')
  @HttpCode(200)
  updateTask(@Param('taskid') taskid: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.updateTask(taskid, dto);
  }

  @Delete('/:taskid')
  @HttpCode(200)
  deleteTask(@Param('taskid') taskid: string) {
    return this.taskService.deleteTask(taskid);
  }
}
