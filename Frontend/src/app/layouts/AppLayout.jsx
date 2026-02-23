//src/app/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";

/**
 * AppLayout
 * Layout générique pour TOUS les rôles
 */
export const AppLayout = ({ menu, actions }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      
      <AppSidebar menu={menu} actions={actions} />

      <div className="flex flex-col flex-1">
        <AppTopbar />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 bg-light p-4 overflow-y-auto border-t border-l border-dark/10 rounded-tl-lg"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};
