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
import { TodoDto } from 'src/farm/dto';

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
  getAllTasks() {
    return this.taskService.getAllTasks();
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

  @Post('/:taskid/addTodo')
  @HttpCode(201)
  addTodo(@Param('taskid') taskid: string, @Body() dto: TodoDto) {
    return this.taskService.addTodo(taskid, dto);
  }

  @Put('/updateTodo/:todoid')
  @HttpCode(200)
  updateTodo(@Param('todoid') todoid: string, @Body() dto: TodoDto) {
    return this.taskService.updateTodo(todoid, dto);
  }

  @Delete('/deleteTodo/:todoid')
  @HttpCode(200)
  deleteTodo(@Param('todoid') todoid: string) {
    return this.taskService.deleteTodo(todoid);
  }

  @Delete('/:taskid')
  @HttpCode(200)
  deleteTask(@Param('taskid') taskid: string) {
    return this.taskService.deleteTask(taskid);
  }
}
