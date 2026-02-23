// ---------------- Tag.jsx ----------------
import React from 'react';
export const Tag = ({ children, icon: Icon }) => <span className="px-3 py-1 bg-gray-900 text-white rounded text-sm flex items-center gap-1">{Icon && <Icon className="text-sm" />}{children}</span>;