import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { prisma } from '../services/prisma.js';

export const clerkAuth = ClerkExpressRequireAuth({
  onError: (err, req, res, next) => {
    console.error(`[Erro de Autenticação] Rota: ${req.originalUrl}, Erro: ${err.message}`);
    return res.status(401).json({ error: 'Não autenticado.', clerkError: err.message });
  }
});

export const syncUserWithDb = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const clerkUserId = req.auth.userId;
  console.log(`Verificando usuário do Clerk: ${clerkUserId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: clerkUserId },
    });

    // Se o usuário não existir, cria-o
    if (!user) {
      console.log(`Sincronizando novo usuário: ${clerkUserId}`);

      const clerkUser = req.auth;

      const email = clerkUser.claims.email;
      const name = clerkUser.claims.name || clerkUser.claims.username || '';
      if (!email) {
        console.error('Usuário do Clerk não possui email no token.', clerkUserId);
        return res.status(400).json({ error: 'Não foi possível obter o email do usuário a partir do token. Verifica a configuração de "claims" no Clerk.' });
      }

      await prisma.user.create({
        data: {
          id: clerkUserId,
          email: email,
          name: name,
        },
      });
    }

    // Usuário verificado e sincronizado.
    next();
  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error);
    // Verifica se o erro é de email duplicado (embora o findUnique deva prevenir)
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      return res.status(409).json({ error: 'Um usuário com este email já existe.' });
    }
    return res.status(500).json({ error: 'Erro interno ao processar usuário.' });
  }
};