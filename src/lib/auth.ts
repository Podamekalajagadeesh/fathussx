import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/db";

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: { name?: string; email: string; password: string }) {
  const hashed = await hashPassword(data.password);
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed },
  });
}
