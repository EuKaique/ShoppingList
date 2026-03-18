import { useState } from "react";
import {
  SHOPPING_CATEGORIES,
  getCategoryLabel,
} from "../constants/shoppingCategories";
import { FaCheck, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function ShoppingItem({
  shoppingItem,
  onToggleShoppingItem,
  onEditShoppingItem,
  onDeleteShoppingItem,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(shoppingItem.text);
  const [draftPrice, setDraftPrice] = useState(
    shoppingItem.price === 0 ? "" : String(shoppingItem.price)
  );
  const [draftQuantity, setDraftQuantity] = useState(
    String(shoppingItem.quantity)
  );
  const [draftCategory, setDraftCategory] = useState(shoppingItem.category);

  function handleStartEditing() {
    setDraftText(shoppingItem.text);
    setDraftPrice(shoppingItem.price === 0 ? "" : String(shoppingItem.price));
    setDraftQuantity(String(shoppingItem.quantity));
    setDraftCategory(shoppingItem.category);
    setIsEditing(true);
  }

  function handleCancelEditing() {
    setDraftText(shoppingItem.text);
    setDraftPrice(shoppingItem.price === 0 ? "" : String(shoppingItem.price));
    setDraftQuantity(String(shoppingItem.quantity));
    setDraftCategory(shoppingItem.category);
    setIsEditing(false);
  }

  function handleSaveEditing() {
    const trimmedText = draftText.trim();
    const normalizedPrice = draftPrice.trim();
    const parsedPrice = normalizedPrice
      ? Number.parseFloat(normalizedPrice.replace(",", "."))
      : 0;
    const parsedQuantity = Number.parseInt(draftQuantity.trim(), 10);

    if (
      !trimmedText ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return;
    }

    onEditShoppingItem(
      shoppingItem.id,
      trimmedText,
      parsedPrice,
      parsedQuantity,
      draftCategory
    );
    setIsEditing(false);
  }

  return (
    <li className="shopping-item">
      <div className="shopping-main">
        <label className="shopping-content">
          <input
            type="checkbox"
            checked={shoppingItem.completed}
            onChange={() => onToggleShoppingItem(shoppingItem.id)}
          />

          {isEditing ? (
            <div className="shopping-edit-fields">
              <input
                className="shopping-edit-input"
                type="text"
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSaveEditing();
                  }

                  if (event.key === "Escape") {
                    handleCancelEditing();
                  }
                }}
                autoFocus
              />
              <input
                className="shopping-edit-input shopping-price-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço opcional"
                value={draftPrice}
                onChange={(event) => setDraftPrice(event.target.value)}
              />
              <input
                className="shopping-edit-input shopping-quantity-input"
                type="number"
                min="1"
                step="1"
                placeholder="Qtd."
                value={draftQuantity}
                onChange={(event) => setDraftQuantity(event.target.value)}
              />
              <select
                className="shopping-edit-input shopping-category-input"
                value={draftCategory}
                onChange={(event) => setDraftCategory(event.target.value)}
              >
                {SHOPPING_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="shopping-details">
              <span className={shoppingItem.completed ? "completed" : ""}>
                {shoppingItem.text}
              </span>
              <small className="shopping-category">
                {getCategoryLabel(shoppingItem.category)}
              </small>
              <small className="shopping-meta">
                Quantidade: {shoppingItem.quantity}
              </small>
              <strong className="shopping-price">
                {formatCurrency(shoppingItem.price * shoppingItem.quantity)}
              </strong>
            </div>
          )}
        </label>
      </div>

      <div className="shopping-actions">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSaveEditing}>
              <FaCheck />
            </button>
            <button className="secondary-button" onClick={handleCancelEditing}>
              <IoCloseSharp />
            </button>
          </>
        ) : (
          <button className="secondary-button" onClick={handleStartEditing}>
            <FaRegEdit />
          </button>
        )}

        <button
          className="delete-button"
          onClick={() => onDeleteShoppingItem(shoppingItem.id)}
        >
          <FaRegTrashAlt />
        </button>
      </div>
    </li>
  );
}

export default ShoppingItem;
