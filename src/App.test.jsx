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
    await user.type(screen.getByPlaceholderText("Preço"), "10");
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
