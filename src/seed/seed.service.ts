import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService
  ) { }

  async executeSeed() {
    await this.productsService.deleteAllProducts();
    await this.inserNewProducts();

    return `Seed executed`;
  }

  private async inserNewProducts() {

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
