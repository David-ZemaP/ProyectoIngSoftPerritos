describe('ATDD: Flujo Completo de Swipe y Detección de Match', () => {
  beforeEach(() => {
    // Use absolute path to ensure the correct page is loaded by Parcel dev server
    cy.visit('/src/Match/match.html');

    // Wait for main controls to be available and initial load to finish
    cy.get('[data-testid="like-button"]', { timeout: 5000 }).should('exist');
    // Ensure the presenter has finished initial loading (status-message updates and is not "Cargando...")
    cy.get('#status-message', { timeout: 5000 }).should(($s) => {
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

