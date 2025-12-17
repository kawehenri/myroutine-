# Instruções de Deploy no GitHub Pages

## ⚠️ IMPORTANTE: Problema Comum

Se você ver o erro `GET https://seu-site.com/src/main.jsx net::ERR_ABORTED 404`, significa que o GitHub Pages está servindo os arquivos de **desenvolvimento** ao invés dos arquivos **buildados**.

**Solução:** Certifique-se de que o GitHub Pages está configurado para servir a branch `gh-pages` (não `main` ou `master`).

## Passo a Passo

### Método 1: Deploy Automático (Recomendado)

1. **Certifique-se de que o repositório está no GitHub**

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Ajuste o `base` no `vite.config.js`:**
   - Se seu repositório é `https://github.com/usuario/myroutine-`, o base deve ser `/myroutine-/`
   - Se seu repositório é `https://github.com/usuario/myroutine`, o base deve ser `/myroutine/`
   - Se seu site é `https://aquafloww.site`, o base deve ser `/` (raiz)

4. **Faça o deploy:**
   ```bash
   npm run deploy
   ```

5. **Configure o GitHub Pages:**
   - Vá em **Settings > Pages** do seu repositório
   - Em **Source**, selecione **Deploy from a branch**
   - Selecione a branch `gh-pages` e a pasta `/ (root)`
   - Clique em **Save**

6. **Aguarde alguns minutos** para o GitHub processar o deploy

### Método 2: Deploy Manual

1. **Faça o build:**
   ```bash
   npm run build
   ```

2. **Verifique se a pasta `dist` foi criada** com os arquivos buildados

3. **Faça commit e push da branch `gh-pages`:**
   ```bash
   git checkout -b gh-pages
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

   Ou copie o conteúdo da pasta `dist` para a raiz da branch `gh-pages`

4. **Configure o GitHub Pages** para servir a branch `gh-pages`

## 🔧 Solução de Problemas

### Erro 404 ao carregar arquivos JS/CSS

**Causa:** GitHub Pages está servindo arquivos de desenvolvimento.

**Solução:**
1. Verifique se a branch `gh-pages` existe e contém os arquivos buildados
2. Verifique se o GitHub Pages está configurado para servir a branch `gh-pages`
3. Verifique se o `base` no `vite.config.js` corresponde ao caminho do seu site

### Site não atualiza após deploy

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
2. Aguarde alguns minutos - o GitHub Pages pode levar até 10 minutos para atualizar
3. Verifique se o deploy foi bem-sucedido na aba **Actions** do GitHub

### Caminhos incorretos

Se você está usando um domínio customizado (ex: `aquafloww.site`), o `base` deve ser `/`:

```js
// vite.config.js
export default defineConfig({
  base: '/', // Para domínio customizado
  // base: '/myroutine-/', // Para github.io/myroutine-
})
```

## 📝 Notas Importantes

- O projeto usa **HashRouter** para compatibilidade com GitHub Pages
- Todos os dados são salvos no `localStorage` do navegador
- Não é necessário configurar nenhum backend ou banco de dados
- A pasta `dist` contém os arquivos buildados e **deve** ser commitada na branch `gh-pages`
- Nunca faça commit da pasta `dist` na branch `main` (ela está no `.gitignore`)

