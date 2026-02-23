//src/app/providers/AppProviders.jsx
export const AppProviders = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  </AuthProvider>
);