import { NavLink } from "react-router-dom";


function Sidebar({ menu }) {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-xl font-bold">
          📦 Inventory Management
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />

              <span>{item.title}</span>

            </NavLink>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-700 p-4 text-center text-sm text-slate-400">

        © Inventory Management System

      </div>

    </aside>
  );
}

export default Sidebar;