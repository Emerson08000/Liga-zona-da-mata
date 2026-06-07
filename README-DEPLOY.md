# 🚀 Guia de Deploy - LZMF

Este guia explica como fazer deploy do site da LZMF com **dois ambientes separados**: um para o site público e outro para o painel administrativo.

## 📋 Opção 1: Deploy Único (Recomendado para começar)

### Netlify

1. **Crie uma conta no Netlify**: https://netlify.com
2. **Conecte seu repositório GitHub**
3. **Configure as variáveis de ambiente**:
   - Vá em `Site settings` > `Environment variables`
   - Adicione: `VITE_ADMIN_PASSWORD` = `SuaSenhaSecreta`
4. **Deploy settings**:
   - Build command: `pnpm install && pnpm build`
   - Publish directory: `dist`

### Vercel

1. **Crie uma conta no Vercel**: https://vercel.com
2. **Import seu repositório**
3. **Configure as variáveis de ambiente**:
   - Em `Settings` > `Environment Variables`
   - Adicione: `VITE_ADMIN_PASSWORD` = `SuaSenhaSecreta`
4. **Deploy automático** já está configurado

### Acessos:
- Site público: `https://seu-site.netlify.app/`
- Painel Admin: `https://seu-site.netlify.app/admin`

---

## 🔒 Opção 2: Dois Sites Separados (Mais Seguro)

Para ter **dois domínios diferentes**, você pode criar duas versões:

### Site Público (lzmf.com.br)
1. Faça deploy normalmente seguindo a Opção 1
2. Use um domínio customizado para o site público

### Site Admin (admin-lzmf.com.br)
1. Crie um **segundo projeto no Netlify/Vercel**
2. Configure para redirecionar para `/admin` automaticamente
3. Adicione proteção por senha no nível do servidor (Netlify Password Protection)

#### Proteção Extra no Netlify:
Crie um arquivo `netlify.toml` na raiz do projeto admin:

```toml
[[redirects]]
  from = "/*"
  to = "/admin/:splat"
  status = 200

[build]
  command = "pnpm install && pnpm build"
  publish = "dist"

# Proteção com senha básica (Netlify Pro)
[context.production.environment]
  SITE_PASSWORD = "SuaSenhaExtra"
```

---

## 🔐 Alterando a Senha do Admin

### Localmente:
1. Abra o arquivo `.env`
2. Altere a linha: `VITE_ADMIN_PASSWORD=SuaNovaSenha`
3. Reinicie o servidor de desenvolvimento

### No Netlify/Vercel:
1. Vá em **Settings** > **Environment Variables**
2. Edite `VITE_ADMIN_PASSWORD`
3. Faça um novo deploy

---

## 🛡️ Segurança Adicional (Opcional)

### 1. Proteção por IP (Cloudflare)
- Use Cloudflare para restringir acesso ao `/admin` apenas para seu IP

### 2. Autenticação OAuth (Netlify Identity)
- Configure Netlify Identity para login com email/senha

### 3. HTTP Basic Auth
Adicione ao `netlify.toml`:
```toml
[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200
  force = true
  headers = {X-Robots-Tag = "noindex"}
```

---

## 📱 Estrutura de URLs

### Deploy Único:
```
https://lzmf.netlify.app/          → Site público
https://lzmf.netlify.app/admin     → Painel admin (protegido por senha)
```

### Deploy Separado:
```
https://lzmf.com.br/               → Site público
https://admin.lzmf.com.br/         → Painel admin (domínio separado)
```

---

## 🔄 Dados e Sincronização

**IMPORTANTE**: Os dados são salvos no `localStorage` do navegador de cada usuário.

Para persistência real, você precisará:
1. Backend (Firebase, Supabase, etc.)
2. Banco de dados
3. API para sincronizar dados

Quer ajuda para implementar um backend real? Posso configurar Firebase ou Supabase para você!

---

## 📞 Suporte

Se tiver dúvidas sobre o deploy, me avise!
