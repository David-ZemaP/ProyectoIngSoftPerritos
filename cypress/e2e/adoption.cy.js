describe('ATDD: Adoption Flow (smoke)', () => {
  beforeEach(() => {
    // Use absolute path to ensure correct file is loaded by Parcel dev server
    cy.visit('/src/Match/match.html');
  });

  it('Muestra la tarjeta de mascota y el status', () => {
    // Verificar que la tarjeta de mascota y el mensaje de estado existen
    cy.get('[data-testid="pet-card"]').should('exist');
    cy.get('#status-message').should('exist').invoke('text').should('be.a', 'string');
  });
});
