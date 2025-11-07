# API de Gerenciamento de Tarefas (To-Do List Backend)

Este repositório contém o código-fonte do backend para o Sistema de Gerenciamento de Tarefas. A API é responsável por todas as regras de negócio, autenticação de usuários e gerenciamento de dados com o banco.

O projeto foi desenvolvido com Node.js, Express e Prisma, fornecendo uma interface RESTful para ser consumida por um cliente frontend (como o React).

## ✨ Funcionalidades Principais

* **Gerenciamento de Usuários:** Cadastro e autenticação segura com JWT.
* **Gerenciamento de Tarefas (CRUD):** Os usuários podem criar, ler, atualizar e excluir as suas próprias tarefas.
* **Segurança:** As rotas são protegidas, garantindo que um usuário só possa acessar as suas próprias tarefas.
* **Filtragem:** Permite a filtragem de tarefas por status (pendente/concluída).

## 🛠️ Tecnologias Utilizadas

A stack principal do backend é composta por:

* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express:** Framework para construção das rotas da API.
* **Prisma:** ORM para interação com o banco de dados (MySQL).
* **Postgres:** Banco de dados relacional para persistência dos dados.
* **Clerk Auth:** Para geração e validação de tokens de autenticação.

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
    # Exemplo: postgres://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO
    DATABASE_URL="postgres://root:123456@localhost:3306/todolist"

    # Chave secreta para o JWT (use um gerador online para criar uma chave forte)
    JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_FORTE"

    # Porta da aplicação
    PORT=3333
    ```

4.  **Execute as Migrações do Banco:**
    O Prisma usará o schema para criar as tabelas no seu banco de dados.
    ```bash
    npx prisma migrate dev
    ```

### 3. Executando a Aplicação

Após a instalação, inicie o servidor:

```bash
npm run dev
