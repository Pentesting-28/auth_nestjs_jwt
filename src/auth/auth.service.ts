import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>){}

  async login(loginAuthDto: LoginAuthDto) {

    const { password, email } = loginAuthDto;

    const findUser = await this.UserModel.findOne({ email });

    if(!findUser){
      throw new HttpException('USER_NOT_FOUND', 404);
    }

    const passwordCheck = await bcrypt.compare(password, findUser.password);

    if(!passwordCheck){
      throw new HttpException('PASSWORD_INCORRECT', 403);
    }

    const data = findUser;

    return data;

  }

  async register(registerAuthDto: RegisterAuthDto) {

    const { password } = registerAuthDto;

    const passwordTreatment = await bcrypt.hash(password, 10);

    registerAuthDto = {...registerAuthDto, password: passwordTreatment};

    return await this.UserModel.create(registerAuthDto);
  }
}
