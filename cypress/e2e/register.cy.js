describe("Registro de Mascota E2E", () => {
    
    // Antes de cada prueba, navegamos a la página
    beforeEach(() => {
        // Asegúrate de que esta ruta es correcta para Parcel/tu servidor
        cy.visit("http://localhost:1234/src/Register_Pet/Register.html"); 
        
        // Alias para el contenedor de mensajes
        cy.get('#form-message')
            .as('messageBox')
            .should('have.class', 'hidden') // Comprobamos que inicia oculto
            .should('not.have.class', 'text-success text-error'); 
        
        // No es estrictamente necesario, pero ayuda a la estabilidad visual
        cy.wait(100); 
    });
    
    // ----------------------------------------------------------------------
    // --- Test 1: Fallo por falta de campos obligatorios 
    // ----------------------------------------------------------------------
    it('1. Debe mostrar error si faltan campos obligatorios (*)', () => {
        const expectedError = 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.';

        // Campo 'Nombre' rellenado. Faltan 'Especie' y 'Sexo'.
        cy.get('input#name').type('Fido'); 
        
        cy.get('button[type="submit"]').click();

        // 🚨 Aserciones de Fallo
        cy.get('@messageBox')
            // 1. Debe estar visible
            .should('not.have.class', 'hidden') 
            // 2. Debe tener la clase de error (asumiendo que está definida en register.presenter)
            .and('have.class', 'text-error') 
            // 3. Debe contener el mensaje específico
            .and('contain', expectedError);
            
        // El reset NO debe ocurrir aquí, así que el mensaje permanece.
    });
    
    // ----------------------------------------------------------------------
    // --- Test 2: Registro con campos mínimos 
    // ----------------------------------------------------------------------
    it("2. Debe registrar exitosamente una mascota con campos mínimos (Nombre, Especie, Sexo) y limpiar la vista", () => {
        const petName = "Luna";
        const successMessage = `¡${petName} ha sido registrado(a) exitosamente!`;

        // Llenar campos obligatorios
        cy.get('input#name').type(petName);
        cy.get('select#species').select('perro', { force: true }); 
        cy.get('input#female').check({ force: true }); 

        cy.get('button[type="submit"]').click();
        
        // 🚨 AÑADIR ESPERA ASÍNCRONA. 
        // Esto fuerza a Cypress a esperar que la llamada asíncrona del Presentador termine.
        cy.wait(500); // 0.5 segundos debería ser suficiente para una operación local.

        // Aserciones de Éxito y Visibilidad
        cy.get('@messageBox')
            // 🚨 Aserción CLAVE: DEBE quitar la clase 'hidden' para mostrar el éxito
            .should('not.have.class', 'hidden') 
            .and('have.class', 'text-success')
            .and('contain', successMessage);
            
        // 🚨 Aserciones de Limpieza (Debe ser la última aserción)
        cy.wait(200); // Esperamos la ejecución de resetFormView()
        cy.get('input#name').should('have.value', '');
        cy.get('select#species option:selected').should('have.value', ''); 
        cy.get('input#female').should('not.be.checked');
        cy.get('@messageBox').should('have.class', 'hidden'); // El mensaje debe estar oculto de nuevo
    });

    // ----------------------------------------------------------------------
    // --- Test 3: Registro completo 
    // ----------------------------------------------------------------------
    it('3. Debe registrar correctamente una mascota con todos los campos y limpiar la vista', () => {
        const petName = 'Rocky';
        const successMessage = `¡${petName} ha sido registrado(a) exitosamente!`;
        
        // Obligatorios
        cy.get('input#name').type(petName);
        cy.get('select#species').select('gato', { force: true });
        cy.get('input#male').check({ force: true });
        
        // Opcionales
        cy.get('input#age').type('3 años');
        cy.get('input#breed').type('Siamés'); 
        cy.get('textarea#personality').type('Tranquilo y amigable, le encantan las siestas.'); 

        cy.get('button[type="submit"]').click();

        // 🚨 AÑADIR ESPERA ASÍNCRONA.
        cy.wait(500); // 0.5 segundos

        // Aserciones de Éxito
        cy.get('@messageBox')
            .should('not.have.class', 'hidden') // 🚨 Verificar que se hizo visible
            .and('have.class', 'text-success')
            .and('contain', successMessage);

        // Aserciones de Limpieza
        cy.wait(200); 
        cy.get('input#name').should('have.value', '');
        cy.get('textarea#personality').should('have.value', ''); 
        cy.get('input#male').should('not.be.checked');
        cy.get('@messageBox').should('have.class', 'hidden'); // Verificar que se ocultó
    });
});