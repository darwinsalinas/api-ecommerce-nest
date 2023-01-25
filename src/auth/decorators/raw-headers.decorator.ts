import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const RawHeaders = createParamDecorator((data, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest();
    const headers = req.rawHeaders;

    if (!headers) {
        throw new Error('Headers not found in request');
    }

    if (data) {
        return headers[data];
    }

    return headers;
});