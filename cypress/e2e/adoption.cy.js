describe('ATDD: Adoption Flow', () => {
  beforeEach(() => {
    cy.visit('src/Match/match.html');
  });

  it('Should allow a user to ADOPT a matched pet', () => {
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Luna');

    cy.get('[data-testid="adopt-btn"]').click();

    // 3. Verification: Success message
    cy.get('#status-message').should('contain.text', '¡Felicidades! Has adoptado a Luna.');
  });
});
