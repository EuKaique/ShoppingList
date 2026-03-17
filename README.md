# Lista de Compras

Aplicação web de lista de compras desenvolvida com React e Vite. O projeto permite cadastrar itens com preço opcional e quantidade, editar os dados, marcar itens como comprados e acompanhar os cálculos de total, comprado e restante.

## Visão Geral

Este repositório contém uma SPA simples para controle de compras do dia a dia. A estrutura foi organizada para facilitar evolução e manutenção, com separação entre:

- componentes de interface;
- hooks de regra de negócio;
- estilos centralizados;
- persistência local com `localStorage`.

## Funcionalidades

- adicionar itens à lista de compras;
- informar preço opcional por item;
- informar quantidade por item;
- editar nome, preço e quantidade;
- marcar itens como comprados;
- excluir itens individualmente;
- limpar itens comprados;
- filtrar por `Todas`, `Pendentes` e `Concluídas`;
- calcular `Total`, `Comprado` e `Restante`;
- alternar entre tema claro e escuro;
- salvar lista e tema no navegador.

## Tecnologias Utilizadas

- React 19
- React DOM 19
- Vite 8
- ESLint 9
- React Icons
- Babel plugin para React Compiler

## Arquitetura Atual

O projeto foi dividido em componentes e hooks para deixar o `App` mais simples e a lógica mais reutilizável.

### Componentes

- `TodoHeader`: cabeçalho da aplicação e botão de tema.
- `TaskForm`: formulário de cadastro com nome, preço e quantidade.
- `TaskFilter`: botões de filtro por status.
- `TaskList`: renderização da lista filtrada.
- `TaskItem`: exibição, edição, marcação de compra e exclusão de cada item.

### Hooks

- `useTasks`: centraliza estado dos itens, persistência, filtro, cálculos e ações de adicionar, editar, marcar, excluir e limpar comprados.
- `useTheme`: centraliza leitura inicial do tema, persistência em `localStorage` e alternância entre claro e escuro.

## Como o Projeto Funciona

O componente [src/App.jsx](c:\Users\kaiqu\Documents\workspace\TodoList\src\App.jsx) atua como camada de composição da tela.

- Os estados `itemName`, `itemPrice` e `itemQuantity` controlam o formulário de cadastro.
- O hook [src/hooks/useTasks.js](c:\Users\kaiqu\Documents\workspace\TodoList\src\hooks\useTasks.js) controla os itens da compra.
- O hook [src/hooks/useTheme.js](c:\Users\kaiqu\Documents\workspace\TodoList\src\hooks\useTheme.js) controla o tema.
- Os itens são persistidos em `localStorage` com a chave `tasks`.
- O tema é persistido em `localStorage` com a chave `theme`.
- Quando não existe tema salvo, a aplicação usa `prefers-color-scheme`.
- Os valores monetários são formatados em `BRL`.

Cada item possui a estrutura:

```js
{
  id: Date.now(),
  text: "Arroz",
  price: 25.9,
  quantity: 2,
  completed: false
}
```

O total de cada item é calculado como:

```js
price * quantity
```

## Estrutura do Projeto

```text
TodoList/
|-- public/
|   `-- favicon.svg
|-- src/
|   |-- components/
|   |   |-- TaskFilter.jsx
|   |   |-- TaskForm.jsx
|   |   |-- TaskItem.jsx
|   |   |-- TaskList.jsx
|   |   `-- TodoHeader.jsx
|   |-- hooks/
|   |   |-- useTasks.js
|   |   `-- useTheme.js
|   |-- App.css
|   |-- App.jsx
|   `-- main.jsx
|-- eslint.config.js
|-- index.html
|-- package.json
`-- vite.config.js
```

## Como Executar

### Requisitos

- Node.js instalado
- npm instalado

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

### Preview local da build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Scripts Disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento com hot reload.
- `npm run build`: gera a versão de produção em `dist/`.
- `npm run preview`: sobe um servidor local para validar a build.
- `npm run lint`: executa a análise estática com ESLint.

## Estado Atual do Projeto

- arquitetura modular com componentes e hooks separados;
- lista de compras com preço opcional;
- quantidade por item;
- cálculo de total, comprado e restante;
- edição inline de itens;
- persistência local funcionando;
- build e lint validados.

## Observações Técnicas

- O arquivo `public/favicon.svg` permanece em uso pelo `index.html`.
- O nome interno de alguns arquivos e hooks ainda usa `Task` por herança da primeira versão do projeto.
- Os comandos `npm run lint` e `npm run build` estão funcionando corretamente no estado atual do projeto.

## Possíveis Melhorias Futuras

- atualizar nomes internos de `Task` para `Item` ou `Shopping`;
- incluir testes automatizados;
- adicionar categorias de compra;
- permitir exportação da lista;
- revisar dependências instaladas para remover pacotes que não façam mais parte da solução.

## Autor

Kaique Oliveira Santos
