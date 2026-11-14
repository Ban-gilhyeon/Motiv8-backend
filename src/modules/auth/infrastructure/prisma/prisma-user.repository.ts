import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { User } from "../../domain/entities/user.entity";
import { UserRepositoryPort } from "../../domain/repositories/user-repository.port";

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? User.restore(record) : null;
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? User.restore(record) : null;
  }

  async save(user: User): Promise<User> {
    const record = await this.prisma.user.create({ data: user.props });
    return User.restore(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
