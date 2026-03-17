import { FaLightbulb, FaRegLightbulb } from "react-icons/fa6";

function ShoppingHeader({ darkMode, onToggleTheme }) {
  return (
    <div className="header">
      <h1>Lista de compras</h1>
      <button className="theme-button" onClick={onToggleTheme}>
        {darkMode ? <FaRegLightbulb /> : <FaLightbulb />}
      </button>
    </div>
  );
}

export default ShoppingHeader;
