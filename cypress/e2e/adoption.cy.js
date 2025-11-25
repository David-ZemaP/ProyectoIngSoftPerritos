describe('ATDD: Adoption Flow (smoke)', () => {
  // Usar credenciales de un usuario de prueba
  const testEmail = 'cypressadoption@test.com';
  const testPassword = 'Test123!';

  before(() => {
    // Crear el usuario de prueba (si ya existe, continuará)
    cy.visit('http://localhost:1234/src/signing_up/signing_up.html');
    cy.wait(300);
    cy.get('input#full-name').type('Cypress Adoption Test');
    cy.get('input#email').type(testEmail);
    cy.get('input#password').type(testPassword);
    cy.get('input#confirm-password').type(testPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2500);
  });

  beforeEach(() => {
    // Hacer login antes de cada prueba
    cy.visit('http://localhost:1234/src/login/login.html');
    cy.wait(300);
    cy.get('input#email').clear().type(testEmail);
    cy.get('input#password').clear().type(testPassword);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);

    // Navegar a la página de Match
    cy.visit('http://localhost:1234/src/Match/match.html');
    cy.wait(500);
  });

  it('Muestra la tarjeta de mascota y el status', () => {
    // Verificar que la tarjeta de mascota y el mensaje de estado existen
    cy.get('[data-testid="pet-card"]', { timeout: 10000 }).should('exist');
    cy.get('#status-message').should('exist').invoke('text').should('be.a', 'string');
  });
});
