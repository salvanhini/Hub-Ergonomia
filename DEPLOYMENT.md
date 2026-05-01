# Guia de Implantação e Propriedade

Este documento contém as instruções para manter e rodar seu Sistema de Gestão Ergonômica fora do Google AI Studio.

## 1. Estrutura do Sistema
O sistema é composto por:
- **Frontend:** React + Vite + Tailwind CSS.
- **Backend/Banco de Dados:** Supabase (PostgreSQL).

## 2. Como rodar localmente (No seu computador)
1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Baixe o código do seu repositório GitHub ou o ZIP.
3. No terminal, dentro da pasta do projeto, execute:
   ```bash
   npm install      # Instala as dependências
   npm run dev      # Inicia o servidor de desenvolvimento
   ```
4. O app estará disponível em `http://localhost:3000`.

## 3. Variáveis de Ambiente
Para o sistema funcionar, você precisa das chaves do Supabase. Crie um arquivo chamado `.env` na raiz do projeto com:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 4. Hospedagem Gratuita (Produção)
Recomendamos a **Vercel** ou **Netlify** por serem otimizadas para React:

### Vercel (Recomendado)
1. Conecte seu GitHub na Vercel.
2. Selecione o repositório.
3. Nas "Build Settings", o comando padrão é `npm run build` e a pasta é `dist`.
4. Adicione as chaves acima em "Environment Variables".
5. Clique em Deploy.

## 5. Como ativar o GitHub Pages (Passo a Passo)

Como este é um projeto React (Vite), ele precisa ser "compilado" antes de ser publicado no GitHub Pages. Siga estes passos:

### Passo 1: Exportar para o GitHub
1. No menu lateral do **Google AI Studio**, clique no ícone de engrenagem (Settings).
2. Vá em **Export to GitHub**.
3. Conecte sua conta e crie um novo repositório.

### Passo 2: Configurar o Repositório
No seu computador ou via GitHub Actions:

1. Vá nas **Settings** (Configurações) do seu repositório no GitHub.
2. No menu lateral, clique em **Pages**.
3. Em "Build and deployment" > "Source", mude para **GitHub Actions**.

### Passo 3: Criar o arquivo de Automação
Para que o GitHub compile o app automaticamente, crie um arquivo no seu projeto em: `.github/workflows/deploy.yml` com o seguinte conteúdo:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Passo 4: Variáveis do Supabase no GitHub
1. No seu repositório GitHub, vá em **Settings** > **Secrets and variables** > **Actions**.
2. Clique em **New repository secret**.
3. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com seus respectivos valores.

---

## ❓ Perguntas Frequentes

### Tem problema eu deixar o app aqui no AI Studio?
Não tem problema nenhum! O AI Studio é uma excelente plataforma de desenvolvimento. No entanto, o link de "Preview" do AI Studio é voltado para testes. Para uso profissional constante (clientes acessando o dia todo), hospedar na Vercel ou GitHub Pages é mais robusto.

### Tem risco de um dia esse app se tornar pago?
**O código é seu.** Uma vez que você exportou para o GitHub, o código pertence a você e você pode rodá-lo em qualquer lugar (inclusive no seu próprio computador) sem pagar nada pelo software.
- **Hospedagem:** GitHub Pages, Vercel e Netlify possuem planos gratuitos vitalícios muito generosos.
- **Banco de Dados:** O Supabase tem um plano gratuito (Tiers gratuitos costumam ser suficientes para centenas de laudos). Se você crescer muito, eles podem cobrar, mas você sempre terá a opção de migrar os dados.

### O sistema está seguro no GitHub?
Sim, desde que você **NÃO** coloque suas chaves do Supabase diretamente no código. Use sempre as "Actions Secrets" como explicado no tutorial acima.

