// src/user/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RefreshTokenAuth' }],
  })
  refreshTokens: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
