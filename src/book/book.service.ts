import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService){}
  async create(createBookDto: CreateBookDto) {
    try {
      const findByAuthorId = await this.prisma.author.findFirst({ where: { id: createBookDto.authorId }})
      if (!findByAuthorId) throw new BadRequestException('Author not found')
      const findone = await this.prisma.book.findFirst({ where: { name: createBookDto.name }})
      if (findone) throw new BadRequestException('Book already exists')
      return await this.prisma.book.create({ data: createBookDto })
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'INternal server Error')
    }
  }

  async findAll( search?: string, page: number = 1, limit: number = 10, order = 'desc', column = 'name', priceFrom?: number, priceTo?: number, authorId?: number) {
    try {
      const filters: any[] = [];
  
      if (search) {
        filters.push({
          name: {
            contains: search,
            mode: 'insensitive',
          },
        });
      }
  
      if (priceFrom !== undefined && !isNaN(priceFrom)) {
        filters.push({
          price: {
            gte: priceFrom,
          },
        });
      }
  
      if (priceTo !== undefined && !isNaN(priceTo)) {
        filters.push({
          price: {
            lte: priceTo,
          },
        });
      }
  
      if (authorId !== undefined && !isNaN(authorId)) {
        filters.push({ authorId });
      }
  
      return await this.prisma.book.findMany({
        where: {
          AND: filters,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [column]: order,
        },
        include: {
          Author: true
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }
  

  async findOne(id: number) {
    try {
      const findone = await this.prisma.book.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Book not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'INternal server Error')
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const findone = await this.prisma.book.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Book not found')
      return await this.prisma.book.update({ where: { id }, data: updateBookDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'INternal server Error')
    }
  }

  async remove(id: number) {
    try {
      const findone = await this.prisma.book.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Book not found')
      return await this.prisma.book.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'INternal server Error')
    }
  }
}
