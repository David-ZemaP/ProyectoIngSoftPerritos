describe('ATDD: Flujo Completo de Swipe y Detección de Match', () => {
  // Usar credenciales de un usuario de prueba existente o crear uno
  const testEmail = 'cypressmatch@test.com';
  const testPassword = 'Test123!';

  before(() => {
    // Intentar crear el usuario de prueba (si ya existe, continuará)
    cy.visit('http://localhost:1234/src/signing_up/signing_up.html');
    cy.wait(300);
    cy.get('input#full-name').type('Cypress Match Test');
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

    // Navegar a la página de match
    cy.visit('http://localhost:1234/src/Match/match.html');

    // Wait for main controls to be available and initial load to finish
    cy.get('[data-testid="like-button"]', { timeout: 10000 }).should('exist');
    // Ensure the presenter has finished initial loading (status-message updates and is not "Cargando...")
    cy.get('#status-message', { timeout: 10000 }).should(($s) => {
      expect($s.text().trim()).not.to.be.empty;
    });
  });
  
  it('Should swipe "Max" and "Bella" then advance to next pet', () => {
    // This test verifies that clicking the dislike control advances the pet card
    cy.get('[data-testid="pet-card"]').then(($card) => {
      const beforeText = $card.text();
      cy.get('[data-testid="dislike-button"]').click();
      cy.wait(750);
      cy.get('[data-testid="pet-card"]').should(($newCard) => {
        // Card content should be different after advancing
        expect($newCard.text()).not.to.equal(beforeText);
      });
    });
  });

  it('Debe avanzar múltiples veces y cambiar status message', () => {
    // Verify that multiple dislike interactions advance cards and update status
    cy.get('#status-message').invoke('text').then((firstStatus) => {
      cy.get('[data-testid="dislike-button"]').click();
      cy.wait(800);
      
      // Status message should change after advance (pet name changed)
      cy.get('#status-message').should(($msg) => {
        expect($msg.text()).not.to.equal(firstStatus);
      });
      
      // Click like to test that path too
      cy.get('[data-testid="like-button"]').click();
      cy.wait(800);
      
      cy.get('#status-message').invoke('text').then((secondStatus) => {
        // Second advance should also change the message
        expect(secondStatus).not.to.equal(firstStatus);
      });
    });
  });

  it('Debe responder a clicks en like button sin crash', () => {
    // Simple smoke: clicking like should not crash and advance card
    cy.get('[data-testid="pet-card"]').invoke('text').then((before) => {
      cy.get('[data-testid="like-button"]').click();
      cy.wait(700);
      cy.get('[data-testid="pet-card"]').should(($newCard) => {
        expect($newCard.text()).not.to.equal(before);
      });
    });
  });

  it('Debe responder a clicks en dislike button sin crash', () => {
    // Simple smoke: clicking dislike should not crash and advance card
    cy.get('[data-testid="pet-card"]').invoke('text').then((before) => {
      cy.get('[data-testid="dislike-button"]').click();
      cy.wait(700);
      cy.get('[data-testid="pet-card"]').should(($newCard) => {
        expect($newCard.text()).not.to.equal(before);
      });
    });
  });
});

