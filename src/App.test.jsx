import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import App from "./App";

function getSummaryValue(label) {
  const card = screen.getByText(label).closest(".summary-card");
  return within(card).getByText(/R\$\s*/);
}

describe("Shopping app", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  test("adds an item without price and keeps total at zero", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Banana");
    await user.clear(screen.getByPlaceholderText("Qtd."));
    await user.type(screen.getByPlaceholderText("Qtd."), "3");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoria do item" }),
      "hortifruti"
    );
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    const shoppingItem = screen.getByText("Banana").closest(".shopping-item");

    expect(within(shoppingItem).getByText("Banana")).toBeInTheDocument();
    expect(within(shoppingItem).getByText("Hortifruti")).toBeInTheDocument();
    expect(within(shoppingItem).getByText("Quantidade: 3")).toBeInTheDocument();
    expect(getSummaryValue("Total")).toHaveTextContent(/R\$\s*0,00/);
  });

  test("calculates total purchased and remaining based on price times quantity", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Arroz");
    await user.type(screen.getByPlaceholderText(/Pre/i), "10");
    await user.clear(screen.getByPlaceholderText("Qtd."));
    await user.type(screen.getByPlaceholderText("Qtd."), "2");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(getSummaryValue("Total")).toHaveTextContent(/R\$\s*20,00/);
    expect(getSummaryValue("Comprado")).toHaveTextContent(/R\$\s*0,00/);
    expect(getSummaryValue("Restante")).toHaveTextContent(/R\$\s*20,00/);

    await user.click(screen.getByRole("checkbox"));

    expect(getSummaryValue("Comprado")).toHaveTextContent(/R\$\s*20,00/);
    expect(getSummaryValue("Restante")).toHaveTextContent(/R\$\s*0,00/);
  });

  test("filters items by category", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Sabão");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoria do item" }),
      "limpeza"
    );
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Suco");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoria do item" }),
      "bebidas"
    );
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Categoria" }),
      "limpeza"
    );

    expect(screen.getByText("Sabão")).toBeInTheDocument();
    expect(screen.queryByText("Suco")).not.toBeInTheDocument();
  });

  test("archives purchased items in shopping history", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Arroz");
    await user.type(screen.getByPlaceholderText(/Pre/i), "12");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: /Salvar compra no hist/i })
    );

    expect(screen.queryByText("Arroz")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Ir para hist/i }));

    expect(screen.getAllByRole("heading", { name: /Hist/i })).toHaveLength(2);
    expect(screen.getByRole("columnheader", { name: "Nome" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Qtd" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Pre/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Total" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Aç|Aç|Ac/i })
    ).toBeInTheDocument();

    const arrozCell = screen.getByRole("cell", { name: "Arroz" });
    const historyRow = arrozCell.closest("tr");

    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("Total geral")).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*12,00/)).toHaveLength(4);
    expect(within(historyRow).getByRole("cell", { name: "1" })).toBeInTheDocument();
    expect(within(historyRow).getAllByText(/R\$\s*12,00/)).toHaveLength(2);
  });

  test("edits and deletes a history row", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Feijão");
    await user.type(screen.getByPlaceholderText(/Pre/i), "8");
    await user.clear(screen.getByPlaceholderText("Qtd."));
    await user.type(screen.getByPlaceholderText("Qtd."), "2");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: /Salvar compra no hist/i })
    );
    await user.click(screen.getByRole("button", { name: /Ir para hist/i }));

    await user.click(screen.getByRole("button", { name: /Editar Feij/i }));

    const nameInput = screen.getByDisplayValue("Feijão");
    const numberInputs = screen.getAllByRole("spinbutton");

    await user.clear(nameInput);
    await user.type(nameInput, "Feijão preto");
    await user.clear(numberInputs[0]);
    await user.type(numberInputs[0], "3");
    await user.clear(numberInputs[1]);
    await user.type(numberInputs[1], "9");

    await user.click(screen.getByRole("button", { name: /Salvar Feij/i }));

    const updatedRow = screen
      .getByRole("cell", { name: "Feijão preto" })
      .closest("tr");

    expect(within(updatedRow).getByRole("cell", { name: "3" })).toBeInTheDocument();
    expect(within(updatedRow).getByText(/R\$\s*9,00/)).toBeInTheDocument();
    expect(within(updatedRow).getByText(/R\$\s*27,00/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Excluir Feij/i }));

    expect(screen.getByText(/Nenhuma compra salva no hist/i)).toBeInTheDocument();
  });

  test("clears the entire history", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Leite");
    await user.type(screen.getByPlaceholderText(/Pre/i), "7");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: /Salvar compra no hist/i })
    );

    await user.click(screen.getByRole("button", { name: /Ir para hist/i }));
    await user.click(screen.getByRole("button", { name: /Limpar histórico/i }));

    expect(screen.getByText(/Nenhuma compra salva no hist/i)).toBeInTheDocument();
    expect(screen.getByText("Total geral")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*0,00/)).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Leite" })).not.toBeInTheDocument();
  });

  test("filters items by name in history", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Leite");
    await user.type(screen.getByPlaceholderText(/Pre/i), "7");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Café");
    await user.type(screen.getByPlaceholderText(/Pre/i), "15");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(
      screen.getByRole("button", { name: /Salvar compra no hist/i })
    );

    await user.click(screen.getByRole("button", { name: /Ir para hist/i }));
    await user.type(
      screen.getByPlaceholderText("Buscar item no histórico..."),
      "caf"
    );

    expect(screen.getByRole("cell", { name: "Café" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Leite" })).not.toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*15,00/)).toHaveLength(4);
  });

  test("groups history items by month", () => {
    localStorage.setItem(
      "shoppingHistory",
      JSON.stringify([
        {
          id: 1,
          purchasedAt: "2026-03-15T12:00:00.000Z",
          items: [{ id: 11, text: "Arroz", price: 10, quantity: 2 }],
        },
        {
          id: 2,
          purchasedAt: "2026-02-10T12:00:00.000Z",
          items: [{ id: 22, text: "Feijão", price: 8, quantity: 1 }],
        },
      ])
    );
    window.history.pushState({}, "", "/historico");

    render(<App />);

    expect(screen.getByRole("heading", { name: /março de 2026/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /fevereiro de 2026/i })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Arroz" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Feijão" })).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*20,00/)).toHaveLength(2);
    expect(screen.getAllByText(/R\$\s*8,00/)).toHaveLength(3);
  });

  test("paginates history items with 10 items per page", async () => {
    const historyEntries = Array.from({ length: 11 }, (_, index) => ({
      id: index + 1,
      purchasedAt: "2026-03-15T12:00:00.000Z",
      items: [
        {
          id: index + 101,
          text: `Item ${index + 1}`,
          price: 1,
          quantity: 1,
        },
      ],
    }));

    localStorage.setItem("shoppingHistory", JSON.stringify(historyEntries));
    window.history.pushState({}, "", "/historico");

    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Item 1" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Item 10" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Item 11" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Próxima" }));

    expect(screen.getByText("Página 2 de 2")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Item 11" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Item 1" })).not.toBeInTheDocument();
  });

  test("repeats a month purchase into the shopping list", async () => {
    localStorage.setItem(
      "shoppingHistory",
      JSON.stringify([
        {
          id: 1,
          purchasedAt: "2026-03-15T12:00:00.000Z",
          items: [
            { id: 11, text: "Arroz", price: 10, quantity: 2, category: "mercearia" },
            { id: 12, text: "Café", price: 15, quantity: 1, category: "mercearia" },
          ],
        },
      ])
    );
    window.history.pushState({}, "", "/historico");

    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /Repetir compra do mês/i }));
    await user.click(screen.getByRole("button", { name: /Ir para lista/i }));

    expect(screen.getByText("Arroz")).toBeInTheDocument();
    expect(screen.getByText("Café")).toBeInTheDocument();
    expect(screen.getByText("Quantidade: 2")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(2);
  });

  test("navigates between list and history using the header button", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /Ir para hist/i }));

    expect(
      screen.getByText(/Nenhuma compra salva no hist/i)
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/historico");

    await user.click(screen.getByRole("button", { name: /Ir para lista/i }));

    expect(screen.getByPlaceholderText("Digite um item...")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  test("filters items by name", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Banana");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.type(screen.getByPlaceholderText("Digite um item..."), "Maca");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    await user.type(
      screen.getByPlaceholderText("Filtrar por nome..."),
      "ban"
    );

    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.queryByText("Maca")).not.toBeInTheDocument();
  });
});
