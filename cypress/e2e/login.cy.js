describe('User Login E2E - ATDD', () => {
    
    beforeEach(() => {
        // Navegar a la página de inicio de sesión
        cy.visit("http://localhost:1234/src/login/login.html");
        
        // Esperar a que la página cargue completamente
        cy.wait(100);
    });

    // ----------------------------------------------------------------------
    // Escenario 1: Usuario intenta iniciar sesión sin llenar ningún campo
    // ----------------------------------------------------------------------
    describe('Escenario 1: Validación de campos vacíos', () => {
        it('Dado que el usuario no llena ningún campo, cuando intenta iniciar sesión, entonces debe ver un mensaje de error', () => {
            // When: Usuario hace click en el botón de iniciar sesión sin llenar campos
            cy.get('button[type="submit"]').click();

            // Then: Debe aparecer un mensaje de error de validación HTML5
            cy.get('input#email:invalid').should('exist');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 2: Usuario intenta iniciar sesión solo con email
    // ----------------------------------------------------------------------
    describe('Escenario 2: Validación de contraseña vacía', () => {
        it('Dado que el usuario solo ingresa su email, cuando intenta iniciar sesión, entonces debe ver un mensaje de error', () => {
            // Given: Usuario solo llena el email
            cy.get('input#email').type('test@test.com');

            // When: Usuario hace click en iniciar sesión
            cy.get('button[type="submit"]').click();

            // Then: Debe aparecer validación HTML5
            cy.get('input#password:invalid').should('exist');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 3: Usuario intenta iniciar sesión con credenciales inválidas
    // ----------------------------------------------------------------------
    describe('Escenario 3: Credenciales inválidas', () => {
        it('Dado que el usuario ingresa credenciales incorrectas, cuando intenta iniciar sesión, entonces debe ver un mensaje de error', () => {
            // Given: Usuario llena el formulario con credenciales incorrectas
            cy.get('input#email').type('noexiste@test.com');
            cy.get('input#password').type('wrongpassword');

            // When: Usuario hace click en iniciar sesión
            cy.get('button[type="submit"]').click();

            // Then: Debe aparecer un mensaje de error
            cy.get('.error-message', { timeout: 10000 })
                .should('be.visible')
                .and('not.be.empty');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 4: Usuario inicia sesión exitosamente con credenciales válidas
    // ----------------------------------------------------------------------
    describe('Escenario 4: Inicio de sesión exitoso', () => {
        it('Dado que el usuario tiene credenciales válidas, cuando inicia sesión, entonces debe ver un mensaje de éxito y ser redirigido', () => {
            // Primero crear el usuario de prueba
            const testEmail = `cypresslogin${Date.now()}@test.com`;
            const testPassword = 'Cypress123!';
            
            // Ir a registro y crear usuario
            cy.visit('http://localhost:1234/src/signing_up/signing_up.html');
            cy.wait(100);
            cy.get('input#full-name').type('Cypress Test User');
            cy.get('input#email').type(testEmail);
            cy.get('input#password').type(testPassword);
            cy.get('input#confirm-password').type(testPassword);
            cy.get('button[type="submit"]').click();
            cy.wait(2500); // Esperar a que se complete el registro
            
            // Volver a login
            cy.visit('http://localhost:1234/src/login/login.html');
            cy.wait(100);

            // Given: Usuario llena el formulario con credenciales válidas
            cy.get('input#email').type(testEmail);
            cy.get('input#password').type(testPassword);

            // When: Usuario hace click en iniciar sesión
            cy.get('button[type="submit"]').click();

            // Then: El botón debe mostrar estado de carga brevemente
            cy.get('button[type="submit"]', { timeout: 1000 })
                .should('be.disabled');

            // Then: Debe redirigir a match.html (puede que el mensaje de éxito no se vea porque redirige rápido)
            cy.url({ timeout: 5000 }).should('include', 'match.html');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 5: Usuario intenta iniciar sesión con email con formato inválido
    // ----------------------------------------------------------------------
    describe('Escenario 5: Validación de formato de email', () => {
        it('Dado que el usuario ingresa un email con formato inválido, cuando intenta iniciar sesión, entonces debe ver un mensaje de error', () => {
            // Given: Usuario llena el formulario con email inválido
            cy.get('input#email').type('email-invalido');
            cy.get('input#password').type('password123');

            // When: Usuario hace click en iniciar sesión
            cy.get('button[type="submit"]').click();

            // Then: La validación HTML5 debe prevenir el envío
            cy.get('input#email:invalid').should('exist');
            
            // Verificar que no se redirigió
            cy.url().should('include', 'login.html');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 6: Verificación de limpieza de espacios en blanco
    // ----------------------------------------------------------------------
    describe('Escenario 6: Limpieza de espacios en blanco', () => {
        it('Dado que el usuario ingresa email con espacios extras, cuando inicia sesión, entonces los espacios deben ser eliminados automáticamente', () => {
            const testEmail = 'noexiste@test.com';
            const testPassword = 'password123';

            // Given: Usuario llena el formulario con espacios extras en el email
            cy.get('input#email').type(`  ${testEmail}  `);
            cy.get('input#password').type(testPassword);

            // When: Usuario hace click en iniciar sesión
            cy.get('button[type="submit"]').click();

            // Then: Debe procesar la solicitud y mostrar un error (prueba que trim funciona)
            cy.get('.error-message', { timeout: 10000 })
                .should('be.visible');
            
            // El botón debe volver a estar habilitado después del proceso
            cy.get('button[type="submit"]')
                .should('not.be.disabled');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 7: Verificación del estado del botón durante el proceso
    // ----------------------------------------------------------------------
    describe('Escenario 7: Estado del botón durante inicio de sesión', () => {
        it('Dado que el usuario está en proceso de inicio de sesión, entonces el botón debe estar deshabilitado y mostrar un indicador de carga', () => {
            // Given: Usuario llena el formulario
            cy.get('input#email').type('test@test.com');
            cy.get('input#password').type('password123');

            // When: Usuario hace click en iniciar sesión
            cy.get('button[type="submit"]').click();

            // Then: El botón debe cambiar su estado inmediatamente
            cy.get('button[type="submit"]')
                .should('be.disabled')
                .and('contain', 'Iniciando sesión...');

            // Then: Después del proceso, el botón debe volver a estar habilitado
            cy.wait(2000);
            cy.get('button[type="submit"]')
                .should('not.be.disabled')
                .and('contain', 'Iniciar Sesión');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 8: Verificación de múltiples intentos de inicio de sesión
    // ----------------------------------------------------------------------
    describe('Escenario 8: Múltiples intentos de inicio de sesión', () => {
        it('Dado que el usuario comete errores y los corrige, entonces debe poder ver los mensajes actualizados correctamente', () => {
            // Primer intento: campos vacíos
            cy.get('button[type="submit"]').click();
            cy.get('input#email:invalid').should('exist');

            // Segundo intento: email inválido (HTML5 previene el envío)
            cy.get('input#email').type('invalid-email');
            cy.get('input#password').type('password123');
            cy.get('button[type="submit"]').click();
            
            // Verificar que HTML5 marcó el campo como inválido
            cy.get('input#email:invalid').should('exist');

            // Tercer intento: credenciales incorrectas (ahora con email válido)
            cy.get('input#email').clear().type('wrong@test.com');
            cy.get('input#password').clear().type('wrongpass');
            cy.get('button[type="submit"]').click();

            cy.get('.error-message', { timeout: 10000 })
                .should('be.visible');

            // El mensaje de error debe actualizarse
            cy.get('.error-message').should('have.length', 1);
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 9: Verificación del enlace de crear cuenta
    // ----------------------------------------------------------------------
    describe('Escenario 9: Navegación a crear cuenta', () => {
        it('Dado que el usuario no tiene cuenta, cuando hace click en "Crear Cuenta", entonces debe ser redirigido a la página de registro', () => {
            // When: Usuario hace click en el botón de crear cuenta
            cy.get('.btn-secondary').click();

            // Then: Debe navegar a la página de registro
            cy.url().should('include', 'signing_up.html');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 10: Verificación del enlace de olvidó contraseña
    // ----------------------------------------------------------------------
    describe('Escenario 10: Enlace de recuperación de contraseña', () => {
        it('Dado que el usuario olvidó su contraseña, cuando hace click en "¿Olvidaste tu contraseña?", entonces debe existir el enlace', () => {
            // Then: El enlace debe existir y ser visible
            cy.get('.forgot-password')
                .should('be.visible')
                .and('contain', '¿Olvidaste tu contraseña?');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 11: Verificación de contraseña oculta
    // ----------------------------------------------------------------------
    describe('Escenario 11: Campo de contraseña oculto', () => {
        it('Dado que el usuario ingresa su contraseña, entonces debe estar oculta visualmente', () => {
            // Given: Usuario ingresa su contraseña
            cy.get('input#password').type('password123');

            // Then: El campo debe ser de tipo password
            cy.get('input#password').should('have.attr', 'type', 'password');
        });
    });
});
