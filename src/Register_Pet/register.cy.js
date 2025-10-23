describe("Registro de Mascota E2E", () => {
    // Asumiendo que el servidor de desarrollo se ejecuta en este puerto
    beforeEach(() => {
        cy.visit("http://localhost:1234/register.html"); // Aseguramos la visita a la página de registro
        // Limpiamos el mensaje de estado si aparece entre tests
        cy.get('#form-message').as('messageBox').invoke('attr', 'class', 'hidden'); 
    });
    
    // --- Test 1: Fallo por falta de campos obligatorios ---
    it('Debe mostrar error si faltan campos obligatorios (*)', () => {
        // Solo llenamos el nombre, dejando especie y sexo vacíos (obligatorios)
        cy.get('input#name').type('Fido'); 
        
        cy.get('button[type="submit"]').click();

        // Verificamos el mensaje de error del presentador
        cy.get('@messageBox')
          .should('be.visible')
          .and('contain', 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.');
    });
    
    // --- Test 2: Registro mínimo exitoso ---
    it("Debe registrar exitosamente una mascota con campos mínimos (Nombre, Especie, Sexo)", () => {
        const petName = "Luna";

        // Campos obligatorios: Nombre, Especie, Sexo
        cy.get('input#name').type(petName);
        cy.get('select#species').select('perro'); // Valor: perro
        cy.get('input#female').check(); // Seleccionar radio 'hembra'

        cy.get('button[type="submit"]').click();
        
        // El presentador debe mostrar un mensaje de éxito
        cy.get('@messageBox')
          .should('be.visible')
          .and('contain', `¡${petName} ha sido registrado(a) exitosamente!`);

        // Verificamos que el formulario se haya limpiado (resetFormView)
        cy.get('input#name').should('have.value', '');
        cy.get('select#species').should('have.value', '');
        cy.get('input#female').should('not.be.checked');
    });

    // --- Test 3: Registro completo ---
    it('Debe registrar correctamente una mascota con todos los campos', () => {
        const petName = 'Rocky';
        const petPersonality = 'Tranquilo y amigable, le encantan las siestas.';
        
        // Llenar campos obligatorios
        cy.get('input#name').type(petName);
        cy.get('select#species').select('gato');
        cy.get('input#male').check();
        
        // Llenar campos opcionales
        cy.get('input#age').type('3 años');
        cy.get('input#breed').type('Bulldog');
        cy.get('textarea#personality').type(petPersonality); // ID 'personality'

        cy.get('button[type="submit"]').click();

        // El presentador debe mostrar un mensaje de éxito
        cy.get('@messageBox')
          .should('be.visible')
          .and('contain', `¡${petName} ha sido registrado(a) exitosamente!`);
        
        // Se podría agregar un test para simular la subida de la imagen si fuera necesario,
        // pero solo probamos la funcionalidad del formulario aquí.
    });
});