import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isValidUUID } from 'src/helpers';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 25, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: ['images']
    });

    return products.map(product => ({ ...product, images: product.images.map(image => image.url) }));
  }

  async findOne(term: string) {
    let product: Product;
    const isUUID = await isValidUUID(term);

    if (isUUID) {
      product = await this.productRepository.findOne({
        where: { id: term }
      });
    } else {
      const query = this.productRepository.createQueryBuilder('product');

      product = await query
        .where('LOWER(slug) = LOWER(:slug)', { slug: term })
        .orWhere('LOWER(title) = LOWER(:title)', { title: term })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with slug or id ${term} not found`);
    }

    return product;
  }

  async findOneFlat(term: string) {
    const product = await this.findOne(term);

    return { ...product, images: product.images.map(image => image.url) }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...productDetails } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...productDetails });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOneFlat(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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

  deleteAllProducts() {
    return this.productRepository.delete({});
  }

  handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
