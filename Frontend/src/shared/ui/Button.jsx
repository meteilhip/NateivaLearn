// src/components/ui/Button.jsx ----------------
import { motion } from 'framer-motion';

export const Button = ({ children, variant='primary', icon: Icon, onClick, className='', disabled = false }) => {

  const variantsStyle = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    solid: 'bg-red-700 text-white hover:bg-red-800', 
    outline: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
    ghost: 'text-red-600 hover:bg-red-100',
    dark: 'bg-gray-900 text-white hover:bg-black',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <motion.button
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 font-medium flex items-center gap-2 transition-all duration-200 ${variantsStyle[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
    >
      {children}
      {Icon && <Icon />}
    </motion.button>
  );
};