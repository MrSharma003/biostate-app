import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, Document } from 'mongoose';
import { User } from './User';

@Schema()
export class RefreshTokenAuth extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, default: false })
  isRevoked: boolean;

  @Prop({ required: true, type: Date })
  createdAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenAuth);
