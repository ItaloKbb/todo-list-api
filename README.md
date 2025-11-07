# API de Gerenciamento de Tarefas (To-Do List Backend)

Este repositório contém o código-fonte do backend para o Sistema de Gerenciamento de Tarefas. A API é responsável por todas as regras de negócio, autenticação de usuários e gerenciamento de dados com o banco.

O projeto foi desenvolvido com Node.js, Express e Prisma, fornecendo uma interface RESTful para ser consumida por um cliente frontend (como o React).

## ✨ Funcionalidades Principais

* **Gerenciamento de Usuários:** Autenticação segura via [Clerk](https://clerk.com/) e sincronização "Just-in-Time" (JIT) com o banco de dados local.
* **Gerenciamento de Tarefas (CRUD):** Os usuários podem criar, ler, atualizar e excluir as suas próprias tarefas.
* **Segurança:** As rotas são protegidas, garantindo que um usuário só possa acessar as suas próprias tarefas.
* **Filtragem:** Permite a filtragem de tarefas por status (pendente/concluída).

## 🛠️ Tecnologias Utilizadas

A stack principal do backend é composta por:

* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express:** Framework para construção das rotas da API (com versionamento).
* **Prisma:** ORM para interação com o banco de dados.
* **Postgres (via Neon):** Banco de dados relacional para persistência dos dados.
* **Clerk Auth:** Para geração e validação de tokens de autenticação.
* **Zod:** Para validação de DTOs (Data Transfer Objects).
* **dotenv-cli:** Para garantir o carregamento de variáveis de ambiente nos comandos do Prisma.

## 🏗️ Arquitetura e Autenticação

Este projeto utiliza uma arquitetura de módulos e um sistema de autenticação robusto com Clerk.

### 1. Arquitetura de Módulos

A API é estruturada em **módulos** (localizados em `src/modules/`). Cada módulo (ex: `task`) é auto-contido e segue um padrão claro de separação de responsabilidades:

* **`*.routes.js`**: Define os endpoints da API para o módulo. É responsável por aplicar middlewares (como autenticação) e ligar as rotas aos métodos do *Controller*.
* **`*.controller.js`**: A camada que lida com a requisição (Request) e a resposta (Response) HTTP. Ele valida os dados de entrada (usando DTOs), chama o *Service* apropriado e retorna a resposta ao cliente.
* **`*.service.js`**: Contém a lógica de negócio pura. É a única camada que interage com o banco de dados (através do Prisma). Não sabe nada sobre HTTP.
* **`*.dto.js`**: Define os "contratos" de dados usando `zod`. Garante que os dados (ex: `req.body`) que entram na API são válidos antes de serem processados.

### 2. Autenticação (Clerk e Sincronização JIT)

A autenticação não armazena senhas localmente; ela é delegada ao Clerk.

1.  O cliente (frontend) obtém um Token JWT do Clerk após o login.
2.  Para cada requisição à API, o cliente envia este token no cabeçalho `Authorization` (como `Bearer Token`).
3.  O middleware `clerkAuth` (em `src/middlewares/clerkAuth.js`) verifica a validade deste token.
4.  Se o token for válido, o nosso middleware `syncUserWithDb` é executado.

Este middleware aplica o padrão **"Just-in-Time (JIT) Provisioning"**:
* Ele verifica se o `userId` do token já existe na nossa tabela `users` (Postgres).
* **Se não existir**, significa que é o primeiro acesso deste usuário. O middleware cria o usuário no nosso banco de dados, copiando os dados do token.
* Isto garante que a nossa tabela `tasks` possa ter uma chave estrangeira (`user_id`) válida.

### 3. Requisitos: Estrutura de Claims do Token (Clerk)

Para que o *middleware* `syncUserWithDb` funcione, o Token JWT do Clerk **deve** ser personalizado para incluir os dados do usuário.

Isto é feito no painel do Clerk, em **"Customize session token"** (JSON Web Token (JWT) Templates).

Os seguintes "claims" (afirmações) **são obrigatórios** na configuração do token:

```json
{
  "name": "{{user.first_name}}",
  "email": "{{user.primary_email_address}}",
  "userId": "{{user.id}}",
  "username": "{{user.username}}"
}
```

## 📦 Como Executar o Projeto (Localmente)

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

### 1. Pré-requisitos

* Node.js (v18 ou superior)
* NPM ou Yarn
* Um servidor Postgres em execução

### 2. Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/todo-list-system.git](https://github.com/seu-usuario/todo-list-system.git)
    cd todo-list-system/backend 
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto backend, baseado no arquivo `.env.example` (que deves criar).
    ```dotenv
    # Configuração do Banco de Dados (MySQL)
    # Exemplo: postgres://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO
    DATABASE_URL="postgres://root:123456@localhost:5432/todolist"

    # Chave secreta para o JWT (use um gerador online para criar uma chave forte)
    JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_FORTE"

    # Porta da aplicação
    PORT=3333
    ```

4.  **Execute as Migrações do Banco:**
    O Prisma usará o schema para criar as tabelas no seu banco de dados.
    ```bash
        # 1. Executa as migrações (cria as tabelas no banco)
        npx dotenv-cli npx prisma migrate dev

        # 2. Gera o cliente Prisma
        npx dotenv-cli npx prisma generate
    ```

### 3. Executando a Aplicação

Após a instalação, inicie o servidor:

```bash
npm run dev
