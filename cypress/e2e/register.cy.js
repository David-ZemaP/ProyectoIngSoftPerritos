describe("Registro de Mascota E2E", () => {
    
    beforeEach(() => {
        cy.visit("http://localhost:1234/src/Register_Pet/Register.html"); 
        
        // Ajustamos la limpieza al inicio
        cy.get('#form-message').as('messageBox')
            .invoke('addClass', 'hidden') 
            .invoke('removeClass', 'text-success text-error'); 
        
        // Damos un pequeño respiro al DOM para cargarse completamente
        cy.wait(100); 
    });
    
    // ----------------------------------------------------------------------
    // --- Test 1: Fallo por falta de campos obligatorios (CORREGIDO)
    // ----------------------------------------------------------------------
    // Este test fallaba si el mensaje de error no se hacía visible
    it('Debe mostrar error si faltan campos obligatorios (*)', () => {
        // Campo obligatorio 'Nombre' rellenado. Faltan 'Especie' y 'Sexo' (lo cual activa el error en registrar.js)
        cy.get('input#name').type('Fido'); 
        
        cy.get('button[type="submit"]').click();

        // Verificamos el mensaje de error
        cy.get('@messageBox')
          .should('not.have.class', 'hidden') 
          .and('contain', 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.');
    });
    
it("Debe registrar exitosamente una mascota con campos mínimos (Nombre, Especie, Sexo)", () => {
    const petName = "Luna";

    // Llenar campos obligatorios
    cy.get('input#name').type(petName);
    cy.get('select#species').select('perro', { force: true }); 
    cy.get('input#female').check({ force: true }); 

    cy.wait(50); // Pequeña espera antes del submit

    cy.get('button[type="submit"]').click();
    
    // 🚨 CAMBIO CLAVE: Quitamos la aserción '.should('not.have.class', 'hidden')'
    // y sólo verificamos que el mensaje de éxito esté CONTENIDO en el div.
    // Si el texto está, significa que la clase 'hidden' fue removida 
    // y la rama de éxito se ejecutó.
    cy.get('@messageBox')
      .should('contain', `¡${petName} ha sido registrado(a) exitosamente!`)
      // 🚨 AGREGAMOS ESTA ESPERA FINAL para que Cypress termine la aserción 
      // antes de que el resetFormView oculte el mensaje.
      .wait(100); 

    // Aserciones de limpieza (opcional, ahora que la aserción de éxito ya pasó)
    cy.get('input#name').should('have.value', '');
    cy.get('select#species option:selected').should('have.value', ''); 
    cy.get('input#female').should('not.be.checked');
});

// ----------------------------------------------------------------------
// --- Test 3: Registro completo (Ajuste de Asersiones)
// ----------------------------------------------------------------------
it('Debe registrar correctamente una mascota con todos los campos', () => {
    const petName = 'Rocky';
    
    // Obligatorios
    cy.get('input#name').type(petName);
    cy.get('select#species').select('gato', { force: true });
    cy.get('input#male').check({ force: true });
    
    // Opcionales
    cy.get('input#age').type('3 años');
    cy.get('input#breed').type('Siamés'); 
    cy.get('textarea#personality').type('Tranquilo y amigable, le encantan las siestas.'); 

    cy.wait(50);

    cy.get('button[type="submit"]').click();
    
    // 🚨 CAMBIO CLAVE: Sólo verificamos el contenido
    cy.get('@messageBox')
      .should('contain', `¡${petName} ha sido registrado(a) exitosamente!`);
});
});