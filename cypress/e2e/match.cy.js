describe('ATDD: Flujo Completo de Swipe y Detección de Match', () => {
  beforeEach(() => {
    cy.visit('match.html');

    cy.get('[data-testid="like-button"]').should('not.be.disabled');
  });
  it('Should swipe "Max" and "Bella" then MATCH with "Luna"', () => {
    // 1. Dislike Max
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Max');
    cy.get('[data-testid="dislike-button"]').click();
    cy.wait(600); // Wait for animation

    // 2. Dislike Bella
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Bella');
    cy.get('[data-testid="dislike-button"]').click();
    cy.wait(600);

    // 3. Like Luna (The Feature: checking if this action works)
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Luna');
    cy.get('[data-testid="like-button"]').click();

    // 4. Verify Match Message
    cy.get('#match-message').should('be.visible').and('contain.text', '¡ES UN MATCH!');
    cy.get('#matched-pet-name').should('contain.text', 'Con Luna.');
  });

  it('Debe avanzar hasta la mascota "Luna" (pet-3) y generar un MATCH al darle Me gusta', () => {
    cy.log('Swipe: Dislike a Max (pet-1)');
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Max');
    cy.get('[data-testid="dislike-button"]').click();
    cy.wait(550);

    cy.log('Swipe: Dislike a Bella (pet-2)');
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Bella');
    cy.get('[data-testid="dislike-button"]').click();
    cy.wait(550);

    cy.log('Acción Crítica: Like a Luna (pet-3)');
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Luna');
    cy.get('[data-testid="like-button"]').click();

    cy.get('#match-message').should('be.visible').and('contain.text', '¡ES UN MATCH!');

    cy.get('#matched-pet-name').should('contain.text', 'Con Luna.');

    cy.wait(2800);

    cy.get('#match-message').should('not.be.visible');

    cy.get('[data-testid="pet-card"]').should('contain.text', 'Chispa');
  });

  it('No debe generar Match si se da "Me gusta" a una mascota que no cumple la regla (pet-1)', () => {
    cy.log('Acción: Like a Max (pet-1)');
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Max');
    cy.get('[data-testid="like-button"]').click();
    cy.wait(550);

    cy.get('#match-message').should('not.be.visible');

    cy.get('[data-testid="pet-card"]').should('contain.text', 'Bella');
  });

  it('Debe avanzar a la siguiente mascota sin mostrar Match al dar "No me gusta"', () => {
    cy.log('Acción: Dislike a Max (pet-1)');
    cy.get('[data-testid="pet-card"]').should('contain.text', 'Max');
    cy.get('[data-testid="dislike-button"]').click();
    cy.wait(550);

    cy.get('#match-message').should('not.be.visible');

    cy.get('[data-testid="pet-card"]').should('contain.text', 'Bella');
  });
});
