import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StringHistory extends Document {
  @Prop({ required: true })
  input: string;

  @Prop({ required: true })
  longestSubstring: string;

  @Prop({ type: [String], required: true })
  uniqueSubstrings: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const StringHistorySchema = SchemaFactory.createForClass(StringHistory);
