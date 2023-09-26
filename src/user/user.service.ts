import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  async verifyEmail(verificationToken: string): Promise<void> {
    const findUser = await this.userModel.findOne({ verificationToken });

    if (!findUser) throw new NotFoundException();

    await this.userModel.findByIdAndUpdate(findUser._id, {
      verificationToken: null,
      verify: true,
    });
  }

  async verifyAgain(reqMail: string): Promise<void> {
    const findUser = await this.findUserByEmail(reqMail);

    if (!findUser) throw new NotFoundException('User not found');

    const { verify, verificationToken, name, email } = findUser;

    if (verify) {
      throw new BadRequestException('Verification has already been passed');
    }

    await this.emailService.sendEmailConfirmation({
      name,
      email,
      verificationToken,
    });
  }

  async findUserByToken(refreshToken: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ refreshToken });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(
    id: Pick<UserDocument, '_id'>,
  ): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }
}
