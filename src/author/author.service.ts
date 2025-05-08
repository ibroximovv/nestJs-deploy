import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService){}
  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const findone = await this.prisma.author.findFirst({ where: { name: createAuthorDto.name }})
      if (findone) throw new BadRequestException('Authro already exists')
      return await this.prisma.author.create({ data: createAuthorDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(search?: string, page: number = 1, limit: number = 10, order = 'desc', column = 'name') {
    try {
      return await this.prisma.author.findMany({
        where: {
          AND: [
            search ? {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }: {}
          ]
        },
        skip: ( page - 1 ) * limit,
        take: limit,
        orderBy: {
          [column]: order,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: number) {
    try {
      return `This action returns a #${id} author`;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    try {
      return `This action updates a #${id} author`;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: number) {
    try {
      return `This action removes a #${id} author`;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
