import { FaLightbulb, FaRegLightbulb } from "react-icons/fa6";

function ShoppingHeader({
  darkMode,
  onToggleTheme,
  canInstall,
  onInstallClick,
}) {
  return (
    <div className="header">
      <h1>Lista de compras</h1>
      <div className="header-actions">
        {canInstall && (
          <button className="install-button" onClick={onInstallClick}>
            Instalar app
          </button>
        )}
        <button className="theme-button" onClick={onToggleTheme}>
          {darkMode ? <FaRegLightbulb /> : <FaLightbulb />}
        </button>
      </div>
    </div>
  );
}

export default ShoppingHeader;
