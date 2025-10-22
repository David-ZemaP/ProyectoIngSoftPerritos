describe("Registro de Mascota", () => {
    cy.visit("http://localhost:1234");
    
    it("Debe registrar el nombre de una mascota", () => {
      cy.get('input[name="nombre"]').type("Luna");
      cy.get('button[type="submit"]').click();
      cy.contains("Luna").should("be.visible");
    });

//   it('Debe mostrar error si faltan campos obligatorios', () => {
//     cy.get('input[name="nombre"]').type('Luna');
//     cy.get('input[name="edad"]').type('2');
//     // Falta raza y descripción
//     cy.get('button[type="submit"]').click();

//     cy.contains('Faltan campos obligatorios').should('be.visible');
//   });

//   it('Debe registrar correctamente una mascota', () => {
//     cy.get('input[name="nombre"]').type('Rocky');
//     cy.get('input[name="edad"]').type('3');
//     cy.get('input[name="raza"]').type('Bulldog');
//     cy.get('textarea[name="descripcion"]').type('Tranquilo y amigable');
//     cy.get('button[type="submit"]').click();

//     cy.contains('¡Mascota registrada exitosamente!').should('be.visible');
//     cy.url().should('include', '/perfil-mascota');
//   });
});
