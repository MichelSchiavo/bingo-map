# BingoMap Brasil 🗺️

![BingoMap Brasil](https://img.shields.io/badge/BingoMap-Brasil-green)
![Next.js](https://img.shields.io/badge/Next.js-15-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![JWT](https://img.shields.io/badge/JWT-Auth-000000)

Uma aplicação interativa com mapa do Brasil, que permite aos usuários gerenciar viewers por estado brasileiro e acompanhar o ranking dos estados mais populares.

## 🌟 Funcionalidades

- **Autenticação Segura**: Sistema de cadastro e login com JWT e proteção de senhas
- **Mapa Interativo**: Visualize todos os estados brasileiros com dados de viewers em tempo real
- **Gerenciamento de Viewers**: Adicione e remova viewers para qualquer estado
- **Ranking de Estados**: Veja quais estados possuem mais viewers em um ranking dinâmico
- **Design Responsivo**: Interface moderna e adaptada para diferentes tamanhos de tela
- **Modo Escuro**: Suporte completo para tema claro e escuro

## 🔧 Tecnologias Utilizadas

- **Frontend**:
  - Next.js 15 com App Router
  - Tailwind CSS para estilização
  - HeadlessUI para componentes acessíveis
  - SVG Maps para renderização do mapa do Brasil

- **Backend**:
  - API Routes do Next.js
  - Prisma ORM
  - SQLite como banco de dados
  - Autenticação JWT

## 🚀 Começando

### Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd bingo-map
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

6. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## 📋 Estrutura do Projeto

```
bingo-map/
├── prisma/          # Definições do schema do Prisma
├── public/          # Arquivos estáticos
├── src/
│   ├── app/         # Rotas e páginas da aplicação
│   ├── components/  # Componentes React reutilizáveis
│   ├── context/     # Context API para gerenciamento de estado
│   └── lib/         # Utilitários e configurações
```

## 🔐 Autenticação

O sistema utiliza autenticação baseada em JWT (JSON Web Tokens):

1. **Registro**: Os novos usuários podem se cadastrar com email e senha
2. **Login**: Autenticação via email/senha que gera um token JWT
3. **Proteção de Rotas**: Páginas protegidas redirecionam usuários não autenticados
4. **Armazenamento Seguro**: Senhas armazenadas com hash bcrypt

## 🗺️ Mapa Interativo

O mapa do Brasil é construído utilizando SVG e permite:

- **Visualização de Estados**: Cada estado é colorido de acordo com o número de viewers
- **Tooltip Interativo**: Mostra informações do estado ao passar o mouse
- **Modal de Gerenciamento**: Ao clicar no estado, abre um modal para adicionar/remover viewers
- **Atualização em Tempo Real**: O mapa é atualizado instantaneamente após modificações

## 🏆 Ranking de Estados

A aplicação mantém um ranking atualizado dos estados com base no número de viewers:

- Ordenação automática dos estados por popularidade
- Visualização fácil dos estados mais populares
- Integração com o mapa para um acesso rápido

## 📱 Responsividade

A interface foi desenvolvida seguindo o conceito mobile-first:

- Adaptação automática para diferentes tamanhos de tela
- Layout otimizado para dispositivos móveis e desktop
- Interações ajustadas para touch e mouse

## 🧪 Desenvolvimento

- **Desenvolvimento local**: `npm run dev`
- **Build de produção**: `npm run build`
- **Iniciar build**: `npm start`
- **Lint**: `npm run lint`

## 📜 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ✨ Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
