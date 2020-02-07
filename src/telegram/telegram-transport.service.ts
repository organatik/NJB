import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './interface/company.interface';
import { CreateComapnytDTO } from './dto/create-company.dto';

@Injectable()
export class TelegramTransportService {
  constructor(
    @InjectModel('Company') private readonly companyModel: Model<Company>,
  ) {}

  async listCompany(): Promise<Company[] | null> {
    return await this.companyModel.find().exec();
  }

  async addCompany(createComapnytDTO: CreateComapnytDTO): Promise<Company> {
    // const newCompany = new this.companyModel(createComapnytDTO);
    return await this.companyModel.findOneAndUpdate(
      { name: createComapnytDTO.name },
      {
        $push: { identificator: createComapnytDTO.identificator },
      },
      {
        upsert: true,
      },
    );
  }
}
