import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, match: /^[A-Za-z]+$/ })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,80}$/,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  accessToken: string;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ required: false })
  verificationToken: string;

  @Prop({ default: false })
  verify: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
