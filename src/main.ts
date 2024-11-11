import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable cookie parser for CSRF to work
  app.use(cookieParser());

  // Set up CSRF protection
  // app.use(csurf({ cookie: true })); // Enable CSRF with cookies
  app.use(helmet());
  app.enableCors({ origin: '*' });
  await app.listen(8000);
}
bootstrap();
