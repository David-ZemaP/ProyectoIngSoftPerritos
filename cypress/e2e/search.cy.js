
describe('Busqueda de Mascota E2E', () => {
    beforeEach(() => {
        cy.visit('http://localhost:1234/search.html');
        cy.get('#form-message').as('messageBox').invoke('attr', 'class', 'hidden');
    });

    it('Debe mostrar error si no se ingresa ningún criterio', () => {
        cy.get('button[type="submit"]').click();

        cy.get('@messageBox')
            .should('be.visible')
            .and('contain', 'Por favor, ingresa al menos un criterio de búsqueda.');
    });

    it('Debe encontrar una mascota por nombre', () => {
        cy.get('input#name').type('Max');
        cy.get('button[type="submit"]').click();

        cy.get('@messageBox')
            .should('be.visible')
            .and('contain', '¡Mascota Encontrada por nombre!');
    });

    it('Debe encontrar una mascota por edad', () => {
        cy.get('input#age').type('3');
        cy.get('button[type="submit"]').click();

        cy.get('@messageBox')
            .should('be.visible')
            .and('contain', '¡Mascota Encontrada por edad!');
    });

    it('Debe encontrar una mascota por raza', () => {
        cy.get('input#breed').type('Bulldog');
        cy.get('button[type="submit"]').click();

        cy.get('@messageBox')
            .should('be.visible')
            .and('contain', '¡Mascota Encontrada por raza!');
    });

    it('Debe mostrar mensaje si no se encuentra la mascota', () => {
        cy.get('input#name').type('Luna');
        cy.get('input#age').type('2');
        cy.get('input#breed').type('Labrador');

        cy.get('button[type="submit"]').click();

        cy.get('@messageBox')
            .should('be.visible')
            .and('contain', '¡Mascota No Encontrada!');
    });
});
