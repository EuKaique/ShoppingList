import { useState } from "react";
import { FaCheck, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

const ITEMS_PER_PAGE = 10;

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTimeLocal(value) {
  const date = new Date(value);

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function formatMonthLabel(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getHistoryRows(shoppingHistory) {
  return shoppingHistory.flatMap((historyEntry) =>
    historyEntry.items.map((item) => ({
      id: item.id,
      name: item.text,
      purchasedAt: historyEntry.purchasedAt,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))
  );
}

function getMonthlyGroups(historyRows) {
  const groupsMap = new Map();

  historyRows.forEach((historyRow) => {
    const monthKey = historyRow.purchasedAt.slice(0, 7);
    const existingGroup = groupsMap.get(monthKey);

    if (existingGroup) {
      existingGroup.rows.push(historyRow);
      existingGroup.total += historyRow.total;
      return;
    }

    groupsMap.set(monthKey, {
      key: monthKey,
      label: formatMonthLabel(historyRow.purchasedAt),
      total: historyRow.total,
      rows: [historyRow],
    });
  });

  return Array.from(groupsMap.values()).sort((groupA, groupB) =>
    groupB.key.localeCompare(groupA.key)
  );
}

function ShoppingHistory({
  shoppingHistory,
  onEditHistoryItem,
  onDeleteHistoryItem,
  onClearShoppingHistory,
  onRepeatHistoryMonth,
}) {
  const historyRows = getHistoryRows(shoppingHistory);
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftQuantity, setDraftQuantity] = useState("1");
  const [draftPrice, setDraftPrice] = useState("");
  const normalizedNameFilter = nameFilter.trim().toLocaleLowerCase();
  const filteredHistoryRows = historyRows.filter((historyRow) =>
    normalizedNameFilter
      ? historyRow.name.toLocaleLowerCase().includes(normalizedNameFilter)
      : true
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistoryRows.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHistoryRows = filteredHistoryRows.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );
  const monthlyGroups = getMonthlyGroups(paginatedHistoryRows);
  const grandTotal = filteredHistoryRows.reduce(
    (total, historyRow) => total + historyRow.total,
    0
  );

  function handleStartEditing(historyRow) {
    setEditingRowId(historyRow.id);
    setDraftName(historyRow.name);
    setDraftDate(formatDateTimeLocal(historyRow.purchasedAt));
    setDraftQuantity(String(historyRow.quantity));
    setDraftPrice(String(historyRow.price));
  }

  function handleCancelEditing() {
    setEditingRowId(null);
    setDraftName("");
    setDraftDate("");
    setDraftQuantity("1");
    setDraftPrice("");
  }

  function handleSaveEditing() {
    const didSave = onEditHistoryItem(
      editingRowId,
      draftName,
      draftPrice,
      draftQuantity,
      draftDate
    );

    if (didSave) {
      handleCancelEditing();
    }
  }

  return (
    <section className="history-section" aria-labelledby="shopping-history-title">
      <div className="history-header">
        <h2 id="shopping-history-title">Histórico de compras</h2>
        <span>{historyRows.length} item(ns)</span>
      </div>

      <div className="history-total-card">
        <strong>Total geral</strong>
        <span>{formatCurrency(grandTotal)}</span>
      </div>

      <div className="history-name-filter">
        <label htmlFor="history-name-filter">Filtrar histórico por nome</label>
        <input
          id="history-name-filter"
          type="text"
          placeholder="Buscar item no histórico..."
          value={nameFilter}
          onChange={(event) => {
            setNameFilter(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {historyRows.length > 0 && (
        <button className="clear-button" onClick={onClearShoppingHistory}>
          Limpar histórico
        </button>
      )}

      {historyRows.length === 0 ? (
        <p className="empty-message">Nenhuma compra salva no histórico.</p>
      ) : filteredHistoryRows.length === 0 ? (
        <p className="empty-message">Nenhum item encontrado no histórico.</p>
      ) : (
        <>
          <div className="history-months">
            {monthlyGroups.map((monthlyGroup) => (
              <section className="history-month-group" key={monthlyGroup.key}>
                <div className="history-month-header">
                  <div className="history-month-title">
                    <h3>{monthlyGroup.label}</h3>
                    <span>{formatCurrency(monthlyGroup.total)}</span>
                  </div>
                  <button
                    className="shopping-filter-button"
                    type="button"
                    onClick={() =>
                      onRepeatHistoryMonth(
                        monthlyGroup.rows.map((historyRow) => historyRow.id)
                      )
                    }
                  >
                    Repetir compra do mês
                  </button>
                </div>

                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Qtd</th>
                        <th>Preço</th>
                        <th>Total</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyGroup.rows.map((historyRow) => {
                        const isEditing = editingRowId === historyRow.id;
                        const previewTotal =
                          (Number.parseFloat(draftPrice.replace(",", ".")) ||
                            0) *
                          (Number.parseInt(draftQuantity, 10) || 0);

                        return (
                          <tr key={historyRow.id}>
                            <td>
                              {isEditing ? (
                                <input
                                  className="history-input history-name-input"
                                  value={draftName}
                                  onChange={(event) =>
                                    setDraftName(event.target.value)
                                  }
                                />
                              ) : (
                                historyRow.name
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  className="history-input history-number-input"
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={draftQuantity}
                                  onChange={(event) =>
                                    setDraftQuantity(event.target.value)
                                  }
                                />
                              ) : (
                                historyRow.quantity
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  className="history-input history-number-input"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={draftPrice}
                                  onChange={(event) =>
                                    setDraftPrice(event.target.value)
                                  }
                                />
                              ) : (
                                formatCurrency(historyRow.price)
                              )}
                            </td>
                            <td>
                              {isEditing
                                ? formatCurrency(previewTotal)
                                : formatCurrency(historyRow.total)}
                            </td>
                            <td>
                              <div className="history-actions">
                                {isEditing ? (
                                  <>
                                    <button
                                      className="save-button"
                                      onClick={handleSaveEditing}
                                      aria-label={`Salvar ${historyRow.name}`}
                                    >
                                      <FaCheck />
                                    </button>
                                    <button
                                      className="secondary-button"
                                      onClick={handleCancelEditing}
                                      aria-label={`Cancelar edição de ${historyRow.name}`}
                                    >
                                      <IoCloseSharp />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="secondary-button"
                                    onClick={() => handleStartEditing(historyRow)}
                                    aria-label={`Editar ${historyRow.name}`}
                                  >
                                    <FaRegEdit />
                                  </button>
                                )}
                                <button
                                  className="delete-button"
                                  onClick={() =>
                                    onDeleteHistoryItem(historyRow.id)
                                  }
                                  aria-label={`Excluir ${historyRow.name}`}
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="history-pagination">
              <button
                className="shopping-filter-button"
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {safeCurrentPage} de {totalPages}
              </span>
              <button
                className="shopping-filter-button"
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ShoppingHistory;
