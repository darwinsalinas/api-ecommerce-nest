import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Res, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, validImageExtensions } from './helpers/file-filter.helper';
import { fileNamer } from './helpers/file-namer.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Get('product/:fileName')
  getFile(
    @Res() res: Response,
    @Param('fileName') fileName: string
  ) {
    const path = this.filesService.getStaticProductImage(fileName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(`Make sure you are sending an image file with some of these extensions: ${validImageExtensions.join(',')}`)
    }

    const host = this.configService.get('HOST_API');

    return {
      'url': `${host}/files/product/${file.filename}`
    };
  }
}
