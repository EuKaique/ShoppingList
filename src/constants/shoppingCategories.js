export const SHOPPING_CATEGORIES = [
  { value: "hortifruti", label: "Hortifruti" },
  { value: "mercearia", label: "Mercearia" },
  { value: "bebidas", label: "Bebidas" },
  { value: "limpeza", label: "Limpeza" },
  { value: "higiene", label: "Higiene" },
  { value: "outros", label: "Outros" },
];

export function getCategoryLabel(categoryValue) {
  return (
    SHOPPING_CATEGORIES.find((category) => category.value === categoryValue)
      ?.label ?? "Outros"
  );
}
