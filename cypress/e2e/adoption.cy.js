describe('ATDD: Adoption Flow', () => {
  beforeEach(() => {
    // We assume the user is logged in and on the Match or Adoption page
    cy.visit('src/Match/match.html');
    // Ideally, you would navigate to a "My Matches" list here
  });

  it('Should allow a user to ADOPT a matched pet', () => {
    // 1. Setup: Simulate we are viewing a matched pet (e.g., "Luna")
    // For this test, assume we added a generic "Adopt" button to the card for testing
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Luna');

    // 2. Action: Click the Adopt button
    // You will need to add this button to your HTML later
    cy.get('[data-testid="adopt-btn"]').click();

    // 3. Verification: Success message
    cy.get('#status-message').should('contain.text', '¡Felicidades! Has adoptado a Luna.');

    // 4. Verification: The pet should no longer be "available"
    // In a real E2E, we would check the DB or see the status change on screen
  });
});
