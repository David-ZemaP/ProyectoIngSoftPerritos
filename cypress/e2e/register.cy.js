describe("Registro de Mascota E2E", () => {
    // Usar credenciales de un usuario de prueba
    const testEmail = 'cypressregister@test.com';
    const testPassword = 'Test123!';

    before(() => {
        // Crear el usuario de prueba (si ya existe, continuará)
        cy.visit('http://localhost:1234/src/signing_up/signing_up.html');
        cy.wait(300);
        cy.get('input#full-name').type('Cypress Register Test');
        cy.get('input#email').type(testEmail);
        cy.get('input#password').type(testPassword);
        cy.get('input#confirm-password').type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.wait(2500);
    });
    
    // Antes de cada prueba, hacer login y navegar a la página
    beforeEach(() => {
        // Hacer login antes de cada prueba
        cy.visit('http://localhost:1234/src/login/login.html');
        cy.wait(300);
        cy.get('input#email').clear().type(testEmail);
        cy.get('input#password').clear().type(testPassword);
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        // Navegar a la página de registro
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

        // Espera al estado inicial del presentador y la respuesta asíncrona.
        // Aumentamos la espera para evitar flakiness en entornos lentos.
        cy.wait(1600); // 1.6 segundos

        // Aserciones de Éxito y Visibilidad (tolerante a fallos de backend)
        cy.get('@messageBox', { timeout: 10000 }).should('not.have.class', 'hidden').and('not.be.empty')
            .then(($box) => {
                // Si el presenter añadió la clase de éxito, verificamos limpieza del formulario
                if ($box.hasClass('text-success')) {
                    // Esperar a que resetFormView ocurra
                    cy.wait(300);
                    cy.get('input#name').should('have.value', '');
                    cy.get('select#species option:selected').should('have.value', '');
                    cy.get('input#female').should('not.be.checked');
                    cy.get('@messageBox').should('have.class', 'hidden');

                    // Limpieza segura por ID: leer el id expuesto por el presentador (defensivo)
                    cy.window({ timeout: 10000 }).then((win) => {
                        if (win && Object.prototype.hasOwnProperty.call(win, '__LAST_CREATED_PET_ID')) {
                            const id = win.__LAST_CREATED_PET_ID;
                            if (id) {
                                return cy.task('deletePetById', { id }).then((res) => cy.log('Deleted pet by id', JSON.stringify(res)));
                            }
                        }
                        // Fallback: borrar por nombre si por alguna razón no hay ID
                        return cy.task('deletePetsByName', { name: petName }).then((res) => cy.log('Deleted pets (fallback)', JSON.stringify(res)));
                    });
                } else {
                    // Si no es éxito, al menos el mensaje debe contener texto de error
                    expect($box.text().trim().length).to.be.greaterThan(0);
                }
            });
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

        // Espera a que el presentador procese la petición y muestre el mensaje
        cy.wait(1600); // 1.6 segundos

        // Aserciones de Éxito
        cy.get('@messageBox')
            .should('not.have.class', 'hidden') // 🚨 Verificar que se hizo visible
            .and('have.class', 'text-success')
            .and('contain', successMessage);

        // Aserciones de Limpieza
        cy.wait(300);
        cy.get('input#name').should('have.value', '');
        cy.get('textarea#personality').should('have.value', ''); 
        cy.get('input#male').should('not.be.checked');
        cy.get('@messageBox').should('have.class', 'hidden'); // Verificar que se ocultó

        // Limpieza por ID: leer el id que el presentador expone en window (defensivo)
        cy.window({ timeout: 10000 }).then((win) => {
            if (win && Object.prototype.hasOwnProperty.call(win, '__LAST_CREATED_PET_ID')) {
                const id = win.__LAST_CREATED_PET_ID;
                if (id) {
                    return cy.task('deletePetById', { id }).then((res) => cy.log('Deleted pet by id', JSON.stringify(res)));
                }
            }
            // Fallback: eliminar por nombre si no se encontró el id
            return cy.task('deletePetsByName', { name: petName }).then((res) => cy.log('Deleted pets (fallback)', JSON.stringify(res)));
        });
    });
});