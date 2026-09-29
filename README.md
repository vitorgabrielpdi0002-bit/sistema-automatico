# FitPass Automation 🏋️‍♂️

Sistema de gestão de academia com reconhecimento facial, liberação de catracas e cobrança recorrente automatizada.

## 🚀 Arquitetura

- **Backend**: [NestJS](https://nestjs.com/) (Node.js + TypeScript), Prisma ORM e PostgreSQL.
- **Frontend**: [React](https://react.dev/) + Vite + TailwindCSS + Lucide Icons.
- **Banco de Dados**: PostgreSQL 16 (via Docker Compose).
- **Controle de Acesso**: Módulos para integração com leitores faciais e catracas (com auditoria de tentativas liberadas/bloqueadas).
- **Assinaturas & Pagamentos**: Webhooks para conciliação automática com gateways (Stripe, Asaas, Mercado Pago).

---

## 🛠️ Como Iniciar Localmente

### 1. Subir o Banco de Dados (PostgreSQL)
```bash
docker compose up -d
```

### 2. Iniciar o Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```
O servidor backend rodará em `http://localhost:3000`.

### 3. Iniciar o Frontend
```bash
cd frontend
npm install
npm run dev
```
O painel administrativo rodará em `http://localhost:5173`.
