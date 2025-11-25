// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando personalizado para iniciar sesión
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('http://localhost:1234/src/login/login.html');
    cy.wait(200);
    cy.get('input#email').type(email);
    cy.get('input#password').type(password);
    cy.get('button[type="submit"]').click();
    // Esperar a que la autenticación complete y redirija
    cy.wait(2000);
    // Verificar que no estemos en la página de login
    cy.url().should('not.include', '/login.html');
  }, {
    validate() {
      // Validar que la sesión sigue activa verificando localStorage o cookies de Firebase
      cy.window().then((win) => {
        // Firebase Auth guarda el token en localStorage
        const authKeys = Object.keys(win.localStorage).filter(key => 
          key.startsWith('firebase:authUser:')
        );
        expect(authKeys.length).to.be.greaterThan(0);
      });
    }
  });
});

// Comando para crear un usuario de prueba y luego hacer login
Cypress.Commands.add('createUserAndLogin', () => {
  const testEmail = `cypresstest${Date.now()}@test.com`;
  const testPassword = 'Cypress123!';
  const testName = 'Cypress Test User';

  // Crear usuario
  cy.visit('http://localhost:1234/src/signing_up/signing_up.html');
  cy.wait(200);
  cy.get('input#full-name').type(testName);
  cy.get('input#email').type(testEmail);
  cy.get('input#password').type(testPassword);
  cy.get('input#confirm-password').type(testPassword);
  cy.get('button[type="submit"]').click();
  cy.wait(2500);

  // Guardar credenciales para uso posterior
  cy.wrap({ email: testEmail, password: testPassword }).as('testUser');
  
  // Hacer login con el nuevo usuario
  cy.login(testEmail, testPassword);
});

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })