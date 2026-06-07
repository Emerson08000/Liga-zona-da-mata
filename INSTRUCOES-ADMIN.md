# 🔐 Instruções para o Administrador

## Como Acessar o Painel Admin

### 1. **Acesso Local (desenvolvimento)**
- URL: `http://localhost:5173/admin`
- Senha está no arquivo `.env`: `VITE_ADMIN_PASSWORD=MinhaSenhaSecreta2026`

### 2. **Acesso Online (produção)**
- URL: `https://seu-site.netlify.app/admin`
- Senha: A que você configurou nas variáveis de ambiente do Netlify/Vercel

---

## 🔄 Alterando a Senha

### Durante o desenvolvimento:
1. Abra o arquivo `.env` na raiz do projeto
2. Altere: `VITE_ADMIN_PASSWORD=SuaNovaSenha`
3. Salve o arquivo
4. Reinicie o servidor (Ctrl+C e depois execute novamente)

### Em produção (Netlify):
1. Acesse seu dashboard do Netlify
2. Vá em: `Site settings` → `Environment variables`
3. Encontre `VITE_ADMIN_PASSWORD`
4. Clique em `Options` → `Edit`
5. Digite a nova senha
6. Clique em `Save`
7. Vá em `Deploys` e clique em `Trigger deploy` → `Deploy site`

### Em produção (Vercel):
1. Acesse seu dashboard do Vercel
2. Vá em: `Settings` → `Environment Variables`
3. Encontre `VITE_ADMIN_PASSWORD`
4. Clique no ícone de editar (lápis)
5. Digite a nova senha
6. Clique em `Save`
7. Faça um novo deploy (Git push ou Redeploy)

---

## 🎯 Funcionalidades do Painel

### ⚽ Gerenciar Times
- **Adicionar time**: Nome completo, abreviação (3 letras), logo, liga (Futsal/Campo)
- **Editar time**: Clique no ícone de lápis
- **Excluir time**: Clique no ícone de lixeira
- **Logo**: Aceita JPG, PNG, GIF (recomendado: 200x200px)

### 📅 Gerenciar Jogos
- **Agendar jogo**: Selecione times, data, horário e local
- **Registrar resultado**: Mude status para "Finalizado" e insira os placares
- **Editar jogo**: Altere qualquer informação
- **Excluir jogo**: Remove da listagem

### 🏆 Classificação
- Gerada automaticamente com base nos resultados
- Vitória = 3 pontos
- Empate = 1 ponto
- Derrota = 0 pontos
- Saldo de gols calculado automaticamente

---

## 💾 Sobre os Dados

### Armazenamento Atual (LocalStorage):
- ⚠️ Os dados ficam salvos **apenas no seu navegador**
- Se limpar o cache, perde os dados
- Não sincroniza entre dispositivos
- Não há backup automático

### Recomendação:
Para um site profissional, considere migrar para um **backend real**:
- ✅ Firebase (gratuito até 50k acessos/dia)
- ✅ Supabase (gratuito até 500MB)
- ✅ Banco de dados próprio

---

## 🔒 Segurança

### Dicas importantes:
1. **Nunca compartilhe a senha** do admin
2. **Use senha forte**: mínimo 12 caracteres, letras, números e símbolos
3. **Mude a senha regularmente**: a cada 3-6 meses
4. **Não salve a senha** no navegador em computadores públicos
5. **Sempre faça logout** após usar o painel

### Se esquecer a senha:
- Acesse as variáveis de ambiente do Netlify/Vercel
- Veja qual é a senha atual
- Ou altere para uma nova

---

## 📱 Acessando de Dispositivos Móveis

O painel admin funciona em celulares e tablets:
1. Acesse pelo navegador: `https://seu-site.com/admin`
2. Faça login
3. Todas as funcionalidades estão disponíveis

---

## ❓ Problemas Comuns

### "Senha incorreta"
- Verifique se está digitando corretamente
- Confira a senha no arquivo `.env` (local) ou nas variáveis de ambiente (produção)

### "Não consigo acessar /admin"
- Verifique se o site foi implantado corretamente
- Confira se os arquivos de redirecionamento estão configurados

### "Perdi todos os dados"
- Se estiver usando localStorage, os dados podem ter sido limpos
- Considere implementar um backend com backup

---

## 🆘 Suporte

Se precisar de ajuda, entre em contato com o desenvolvedor do site.
