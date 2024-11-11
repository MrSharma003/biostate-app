import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// This custom decorator will get the 'user' from the request (set by the JwtStrategy)
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // This is the user object returned from the JwtStrategy
  },
);
