import { useState } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const [draftPrice, setDraftPrice] = useState(
    task.price === 0 ? "" : String(task.price)
  );
  const [draftQuantity, setDraftQuantity] = useState(String(task.quantity));

  function handleStartEditing() {
    setDraftText(task.text);
    setDraftPrice(task.price === 0 ? "" : String(task.price));
    setDraftQuantity(String(task.quantity));
    setIsEditing(true);
  }

  function handleCancelEditing() {
    setDraftText(task.text);
    setDraftPrice(task.price === 0 ? "" : String(task.price));
    setDraftQuantity(String(task.quantity));
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

    onEdit(task.id, trimmedText, parsedPrice, parsedQuantity);
    setIsEditing(false);
  }

  return (
    <li className="task-item">
      <div className="task-main">
        <label className="task-content">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />

          {isEditing ? (
            <div className="task-edit-fields">
              <input
                className="task-edit-input"
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
                className="task-edit-input task-price-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço opcional"
                value={draftPrice}
                onChange={(event) => setDraftPrice(event.target.value)}
              />
              <input
                className="task-edit-input task-quantity-input"
                type="number"
                min="1"
                step="1"
                placeholder="Qtd."
                value={draftQuantity}
                onChange={(event) => setDraftQuantity(event.target.value)}
              />
            </div>
          ) : (
            <div className="task-details">
              <span className={task.completed ? "completed" : ""}>{task.text}</span>
              <small className="task-meta">Quantidade: {task.quantity}</small>
              <strong className="task-price">
                {formatCurrency(task.price * task.quantity)}
              </strong>
            </div>
          )}
        </label>
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSaveEditing}>
              Salvar
            </button>
            <button className="secondary-button" onClick={handleCancelEditing}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="secondary-button" onClick={handleStartEditing}>
            Editar
          </button>
        )}

        <button className="delete-button" onClick={() => onDelete(task.id)}>
          Excluir
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
