// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Manejar excepciones de módulos duplicados o redefiniciones
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar errores de redefinición de propiedades (común con HMR y módulos)
  if (err.message.includes('Cannot redefine property')) {
    return false;
  }
  // Ignorar errores de requireAuth
  if (err.message.includes('requireAuth')) {
    return false;
  }
  // Permitir que otros errores fallen la prueba
  return true;
});
