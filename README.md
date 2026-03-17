# Lista de Compras

Aplicação web de lista de compras desenvolvida com React e Vite. O projeto permite cadastrar itens com preço opcional, quantidade e categoria, editar os dados, marcar itens como comprados e acompanhar os cálculos de total, comprado e restante.

## Visão Geral

Este repositório contém uma SPA simples para controle de compras do dia a dia. A estrutura foi organizada para facilitar evolução e manutenção, com separação entre:

- componentes de interface;
- hooks de regra de negócio;
- constantes compartilhadas;
- estilos centralizados;
- persistência local com `localStorage`;
- testes automatizados.

## Funcionalidades

- adicionar itens à lista de compras;
- informar preço opcional por item;
- informar quantidade por item;
- definir categoria por item;
- editar nome, preço, quantidade e categoria;
- marcar itens como comprados;
- excluir itens individualmente;
- limpar itens comprados;
- filtrar por status: `Todas`, `Pendentes` e `Concluídas`;
- filtrar por categoria;
- calcular `Total`, `Comprado` e `Restante`;
- alternar entre tema claro e escuro;
- salvar lista e tema no navegador.

## Tecnologias Utilizadas

- React 19
- React DOM 19
- Vite 8
- ESLint 9
- Vitest
- Testing Library
- React Icons
- Babel plugin para React Compiler

## Arquitetura Atual

O projeto foi dividido em componentes e hooks para deixar o `App` mais simples e a lógica mais reutilizável.

### Componentes

- `ShoppingHeader`: cabeçalho da aplicação e botão de tema.
- `ShoppingForm`: formulário de cadastro com nome, preço, quantidade e categoria.
- `ShoppingFilter`: botões de filtro por status.
- `ShoppingCategoryFilter`: seletor de filtro por categoria.
- `ShoppingList`: renderização da lista filtrada.
- `ShoppingItem`: exibição, edição, marcação de compra e exclusão de cada item.

### Hooks

- `useShopping`: centraliza estado dos itens, persistência, filtro, cálculos e ações de adicionar, editar, marcar, excluir e limpar comprados.
- `useTheme`: centraliza leitura inicial do tema, persistência em `localStorage` e alternância entre claro e escuro.

### Constantes

- `shoppingCategories`: lista centralizada de categorias disponíveis e helper para exibição dos rótulos.

## Como o Projeto Funciona

O componente [src/App.jsx](c:\Users\kaiqu\Documents\workspace\TodoList\src\App.jsx) atua como camada de composição da tela.

- Os estados `itemName`, `itemPrice`, `itemQuantity` e `itemCategory` controlam o formulário de cadastro.
- O hook [src/hooks/useShopping.js](c:\Users\kaiqu\Documents\workspace\TodoList\src\hooks\useShopping.js) controla os itens da compra.
- O hook [src/hooks/useTheme.js](c:\Users\kaiqu\Documents\workspace\TodoList\src\hooks\useTheme.js) controla o tema.
- As categorias ficam centralizadas em [src/constants/shoppingCategories.js](c:\Users\kaiqu\Documents\workspace\TodoList\src\constants\shoppingCategories.js).
- Os itens são persistidos em `localStorage` com a chave `shoppingItems`.
- O hook mantém compatibilidade de leitura com a chave antiga `tasks`.
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
  category: "mercearia",
  completed: false
}
```

O total de cada item é calculado como:

```js
price * quantity
```

## Testes Automatizados

O projeto possui testes com `Vitest` e `@testing-library/react`.

Os cenários atuais cobrem:

- adicionar item sem preço;
- cálculo de `Total`, `Comprado` e `Restante`;
- filtro por categoria.

Arquivos principais de teste:

- [src/App.test.jsx](c:\Users\kaiqu\Documents\workspace\TodoList\src\App.test.jsx)
- [src/test/setupTests.js](c:\Users\kaiqu\Documents\workspace\TodoList\src\test\setupTests.js)

## Estrutura do Projeto

```text
TodoList/
|-- public/
|   `-- favicon.svg
|-- src/
|   |-- components/
|   |   |-- ShoppingCategoryFilter.jsx
|   |   |-- ShoppingFilter.jsx
|   |   |-- ShoppingForm.jsx
|   |   |-- ShoppingHeader.jsx
|   |   |-- ShoppingItem.jsx
|   |   `-- ShoppingList.jsx
|   |-- constants/
|   |   `-- shoppingCategories.js
|   |-- hooks/
|   |   |-- useShopping.js
|   |   `-- useTheme.js
|   |-- test/
|   |   `-- setupTests.js
|   |-- App.css
|   |-- App.jsx
|   |-- App.test.jsx
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

### Testes

```bash
npm run test
```

### Testes em modo watch

```bash
npm run test:watch
```

## Scripts Disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento com hot reload.
- `npm run build`: gera a versão de produção em `dist/`.
- `npm run preview`: sobe um servidor local para validar a build.
- `npm run lint`: executa a análise estática com ESLint.
- `npm run test`: executa a suíte de testes uma vez.
- `npm run test:watch`: executa os testes em modo interativo.

## Estado Atual do Projeto

- arquitetura modular com componentes, hooks e constantes separados;
- lista de compras com preço opcional;
- quantidade por item;
- categorias de compra;
- filtro por status e categoria;
- cálculo de total, comprado e restante;
- edição inline de itens;
- persistência local funcionando;
- testes automatizados configurados e passando;
- build e lint validados.

## Observações Técnicas

- O arquivo `public/favicon.svg` permanece em uso pelo `index.html`.
- O projeto usa `shoppingItems` como chave principal no `localStorage`, com fallback de leitura para `tasks`.
- Os comandos `npm run test`, `npm run lint` e `npm run build` estão funcionando corretamente no estado atual do projeto.

## Possíveis Melhorias Futuras

- permitir exportação da lista;
- adicionar ordenação por categoria ou valor;
- incluir testes para edição e limpeza de itens comprados;
- sincronizar dados com backend ou nuvem.

## Autor

Kaique Oliveira Santos
