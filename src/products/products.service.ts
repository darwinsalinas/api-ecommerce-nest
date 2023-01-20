import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isValidUUID } from 'src/helpers';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 25, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let product: Product;
    const isUUID = await isValidUUID(term);

    if (isUUID) {
      product = await this.productRepository.findOne({
        where: { id: term }
      });
    } else {
      const query = this.productRepository.createQueryBuilder();

      product = await query
        .where('LOWER(slug) = LOWER(:slug)', { slug: term })
        .orWhere('LOWER(title) = LOWER(:title)', { title: term })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with slug or id ${term} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const data = await this.productRepository.delete(id);

    if (data.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return;
  }

  handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
