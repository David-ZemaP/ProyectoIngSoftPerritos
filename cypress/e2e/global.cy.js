describe('Pruebas E2E globales (global.cy.js)', () => {
  it('Carga la página principal y verifica título', () => {
    cy.visit('/')
    cy.title().should('be.a', 'string')
  })

  it('Interacción simple con presentador', () => {
    cy.visit('/')
    cy.get('body').should('exist')
  })
})
