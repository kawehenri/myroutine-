# Instruções de Deploy no GitHub Pages

## Passo a Passo

1. **Certifique-se de que o repositório está no GitHub**

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Ajuste o `base` no `vite.config.js`:**
   - Se seu repositório é `https://github.com/usuario/myroutine-`, o base deve ser `/myroutine-/`
   - Se seu repositório é `https://github.com/usuario/myroutine`, o base deve ser `/myroutine/`

4. **Faça o build:**
   ```bash
   npm run build
   ```

5. **Deploy no GitHub Pages:**
   ```bash
   npm run deploy
   ```

   Ou manualmente:
   - Vá em Settings > Pages do seu repositório
   - Selecione a branch `gh-pages` como source
   - A aplicação estará disponível em `https://usuario.github.io/myroutine-/`

## Notas Importantes

- O projeto usa **HashRouter** para compatibilidade com GitHub Pages
- Todos os dados são salvos no `localStorage` do navegador
- Não é necessário configurar nenhum backend ou banco de dados

