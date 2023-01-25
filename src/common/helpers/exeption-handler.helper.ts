import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

const logger = new Logger('Exception Handler');

export const handleError = (error: any) => {
    if (error.code === '23505') {
        throw new BadRequestException(error.detail);
    }

    logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
}