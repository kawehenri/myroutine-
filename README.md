# My Routine - Sistema Completo de Organização Pessoal

Sistema completo de organização de rotina pessoal, 100% frontend, desenvolvido com React + Vite.

## 🎯 Funcionalidades Completas

### 📊 Dashboard
- Visão geral do dia com progresso diário e semanal
- Mensagens motivacionais dinâmicas
- Próximos eventos do cronograma
- Sequências (streaks) de estudo e treino
- Notas rápidas do dia
- Timer de foco integrado

### 📅 Cronograma
- Adicionar eventos por dia com hora, categoria e descrição
- Visualização por dia ou semana
- Marcar eventos como concluídos
- **Templates**: salvar e carregar rotinas pré-definidas
- Navegação entre datas

### 📚 Estudos
- Criar atividades de estudo com tempo planejado
- Marcar como concluída
- Histórico semanal
- Cálculo automático do tempo estudado

### ⏱️ Timer de Foco
- Controle de tempo para estudo, trabalho e treino
- Iniciar/Pausar/Continuar/Finalizar
- Presets de tempo (15, 25, 45, 60 min)
- Tempo personalizado
- Salvamento automático no localStorage

### 🏋️ Treino
- Checkbox diário de treino realizado
- Campo de duração opcional
- Histórico dos últimos 7 dias
- Contador semanal

### 😴 Sono
- Registro de horas dormidas
- Cálculo de média semanal
- Gráfico visual do histórico
- Meta de sono configurável

### 🍽️ Alimentação
- Checklist diário (Café, Almoço, Jantar)
- Progresso visual
- Histórico semanal

### 🌱 Hábitos Personalizados
- Criar hábitos customizados
- Ícones e cores personalizáveis
- Sequências (streaks) por hábito
- Visualização semanal

### 🎯 Metas
- Definir metas semanais ou mensais
- Categorias: estudo, treino, sono, foco
- Acompanhamento de progresso em tempo real
- Indicador visual de metas alcançadas

### 📈 Estatísticas e Relatórios
- Resumo geral de 30 dias
- Sequências (streaks) atuais e melhores
- Gráficos de tempo de estudo
- Gráficos de horas de sono
- Comparativos semanais vs mensais

### 📆 Calendário Mensal
- Visualização completa do mês
- Indicadores visuais de atividades
- Detalhes ao selecionar um dia
- Navegação entre meses

### ⚙️ Configurações
- **Tema Escuro/Claro**: alterne entre temas
- **Exportar/Importar Dados**: backup completo
- **Apagar Todos os Dados**: reset completo
- Meta de sono personalizável
- Toggle de notificações
- Atalhos de teclado
- Informações sobre o sistema

## 🎨 Recursos Avançados

### 🌙 Tema Escuro
- Alternância rápida entre tema claro e escuro
- Preferência salva automaticamente
- Design otimizado para ambos os modos

### 💬 Sistema de Notificações Toast
- Feedback visual imediato de ações
- 4 tipos: success, error, warning, info
- Auto-dismiss após 3 segundos

### 🔥 Sistema de Streaks
- Acompanhamento de dias consecutivos
- Mensagens motivacionais baseadas no streak
- Melhor streak de todos os tempos
- Visual diferenciado para marcos importantes

### 💾 Persistência de Dados
- Dados salvos no localStorage
- Cada dia tem seu próprio registro
- Exportar/Importar para backup
- Dados mantidos após recarregar

### 📱 PWA (Progressive Web App)
- Instalável na home screen
- Funciona offline (básico)
- Service Worker configurado
- Manifest.json completo

### 🎭 Menu Responsivo
- Hamburger menu em dispositivos móveis
- Navegação fluida
- Links organizados por categoria

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool ultra-rápido
- **React Router** - Roteamento (HashRouter para GitHub Pages)
- **localStorage** - Persistência de dados
- **CSS puro** - Estilização
- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📤 Deploy no GitHub Pages

1. Ajuste o `base` no `vite.config.js` para corresponder ao nome do seu repositório
2. Execute:

```bash
npm run deploy
```

## 🎮 Atalhos de Teclado

- `Alt + 1` - Dashboard
- `Alt + 2` - Cronograma
- `Alt + T` - Alternar Tema
- `Esc` - Fechar Modal

## 📊 Estrutura de Dados

Todos os dados são salvos no localStorage:

- `routineData` - Dados diários de todas as categorias
- `metas` - Metas configuradas
- `habitos` - Hábitos personalizados
- `cronogramaTemplates` - Templates salvos
- `theme` - Preferência de tema
- `config` - Configurações do usuário

## 🌟 Destaques

- ✅ **100% Frontend** - Sem necessidade de backend
- ✅ **Offline-first** - Funciona sem internet
- ✅ **Responsivo** - Mobile e desktop
- ✅ **Rápido** - Vite + React otimizado
- ✅ **Completo** - Todas funcionalidades essenciais
- ✅ **Customizável** - Temas, hábitos, metas
- ✅ **Gamificado** - Streaks e progresso visual
- ✅ **Exportável** - Backup de dados

## 💡 Como Usar

1. **Configure seu perfil**: Vá em Configurações e ajuste suas preferências
2. **Adicione hábitos**: Crie hábitos personalizados que deseja acompanhar
3. **Defina metas**: Configure metas semanais ou mensais
4. **Use o cronograma**: Planeje seus dias com eventos
5. **Registre diariamente**: Marque atividades, registre sono, etc.
6. **Acompanhe progresso**: Veja estatísticas e relatórios
7. **Faça backup**: Exporte seus dados regularmente

## 🔒 Privacidade

Todos os seus dados são salvos **apenas no seu navegador**. Nada é enviado para servidores externos. Recomendamos fazer backups regulares usando a função "Exportar Dados".

## 📝 Licença

Este projeto é de código aberto e está disponível para uso pessoal.

---

**Desenvolvido com ❤️ usando React + Vite**
