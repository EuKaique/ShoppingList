import {
  FaClockRotateLeft,
  FaLightbulb,
  FaListUl,
  FaRegLightbulb,
} from "react-icons/fa6";

function ShoppingHeader({
  title,
  darkMode,
  onToggleTheme,
  canInstall,
  onInstallClick,
  isHistoryRoute,
  onNavigateToHistory,
  onNavigateToList,
}) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <div className="header-actions">
        {canInstall && (
          <button className="install-button" onClick={onInstallClick}>
            Instalar app
          </button>
        )}
        <button
          className="theme-button"
          onClick={isHistoryRoute ? onNavigateToList : onNavigateToHistory}
          aria-label={isHistoryRoute ? "Ir para lista" : "Ir para histórico"}
          title={isHistoryRoute ? "Ir para lista" : "Ir para histórico"}
        >
          {isHistoryRoute ? <FaListUl /> : <FaClockRotateLeft />}
        </button>
        <button className="theme-button" onClick={onToggleTheme}>
          {darkMode ? <FaRegLightbulb /> : <FaLightbulb />}
        </button>
      </div>
    </div>
  );
}

export default ShoppingHeader;
