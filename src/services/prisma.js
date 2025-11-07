import { PrismaClient } from '@prisma/client';

/**
 * Exporta uma instância única do PrismaClient.
 * * Ao fazer isto, garantimos que toda a nossa aplicação
 * usa a mesma instância (e o mesmo pool de conexões) 
 * com o banco de dados.
 */
export const prisma = new PrismaClient();