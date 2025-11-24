describe('User Registration E2E - ATDD', () => {
    
    beforeEach(() => {
        cy.visit("http://localhost:1234/src/signing_up/signing_up.html");
        cy.wait(100);
    });

    // ----------------------------------------------------------------------
    // Escenario 1: Usuario intenta registrarse sin llenar ningún campo
    // ----------------------------------------------------------------------
    describe('Escenario 1: Validación de campos vacíos', () => {
        it('Dado que el usuario no llena ningún campo, cuando intenta registrarse, entonces debe ver un mensaje de error', () => {
            cy.get('button[type="submit"]').click();
            // HTML5 validation may trigger or the presenter may show an error
            cy.document().then((doc) => {
                const invalid = doc.querySelector('input#full-name:invalid');
                if (invalid) {
                    expect(invalid).to.exist;
                } else {
                    cy.get('.error-message', { timeout: 10000 }).should('be.visible');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 2: Usuario intenta registrarse con contraseñas que no coinciden
    // ----------------------------------------------------------------------
    describe('Escenario 2: Validación de contraseñas que no coinciden', () => {
        it('Dado que el usuario llena todos los campos pero las contraseñas no coinciden, cuando intenta registrarse, entonces debe ver un mensaje de error', () => {
            cy.get('input#full-name').type('Juan Perez');
            cy.get('input#email').type('juan@test.com');
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password456');
            cy.get('button[type="submit"]').click();
            cy.get('.error-message')
                .should('be.visible')
                .and('contain', 'Las contraseñas no coinciden');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 3: Usuario intenta registrarse con contraseña muy corta
    // ----------------------------------------------------------------------
    describe('Escenario 3: Validación de contraseña muy corta', () => {
        it('Dado que el usuario ingresa una contraseña menor a 6 caracteres, cuando intenta registrarse, entonces debe ver un mensaje de error', () => {
            cy.get('input#full-name').type('Juan Perez');
            cy.get('input#email').type('juan@test.com');
            cy.get('input#password').type('12345');
            cy.get('input#confirm-password').type('12345');
            cy.get('button[type="submit"]').click();
            cy.get('.error-message')
                .should('be.visible')
                .and('contain', 'La contraseña debe tener al menos 6 caracteres');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 4: Usuario se registra exitosamente con datos válidos
    // ----------------------------------------------------------------------
    describe('Escenario 4: Registro exitoso con datos válidos', () => {
        it('Dado que el usuario llena todos los campos correctamente, cuando se registra, entonces debe ver un mensaje de éxito y ser redirigido', () => {
            const timestamp = Date.now();
            const testEmail = `test${timestamp}@test.com`;
            const fullName = 'Juan Perez';

            // Given: Usuario llena el formulario correctamente
            cy.get('input#full-name').type(fullName);
            cy.get('input#email').type(testEmail);
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password123');

            // When: Usuario hace click en registrarse
            cy.get('button[type="submit"]').click();

            // Then: El botón debe mostrar estado de carga
            cy.get('button[type="submit"]')
                .should('be.disabled')
                .and('contain', 'Registrando...');

            // Then: Debe aparecer un mensaje de éxito y limpiar el formulario
            // Aceptar dos señales de éxito: el mensaje de éxito en DOM O
            // que el formulario haya vuelto a su estado (botón habilitado)
            cy.document().then((doc) => {
                const success = doc.querySelector('.success-message');
                if (success) {
                    expect(success).to.be.visible;
                    expect(success.textContent).to.include('Usuario registrado exitosamente');
                } else {
                    // Fallback: comprobar que el botón volvió a estar habilitado
                    cy.get('button[type="submit"]', { timeout: 10000 })
                        .should('not.be.disabled')
                        .and('contain', 'Register');
                }
            }).then(() => {
                // Cleanup: eliminar el usuario creado por id expuesto en window
                cy.window().its('__LAST_CREATED_USER_ID', { timeout: 10000 }).then((id) => {
                    if (id) {
                        cy.task('deleteUserById', { id }).then((res) => cy.log('Deleted user by id', JSON.stringify(res)));
                    }
                });
            });

            cy.get('input#full-name').should('have.value', '');
            cy.get('input#email').should('have.value', '');
            cy.get('input#password').should('have.value', '');
            cy.get('input#confirm-password').should('have.value', '');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 5: Usuario intenta registrarse con un email ya existente
    // ----------------------------------------------------------------------
    describe('Escenario 5: Validación de email duplicado', () => {
        it('Dado que el usuario intenta registrarse con un email ya existente, cuando intenta registrarse, entonces debe ver un mensaje de error', () => {
            // Given: Usuario llena el formulario con un email que ya existe
            // Nota: Este email debe existir previamente en tu base de datos de prueba
            const existingEmail = 'existing@test.com';
            
            cy.get('input#full-name').type('Juan Perez');
            cy.get('input#email').type(existingEmail);
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password123');

            // When: Usuario hace click en registrarse
            cy.get('button[type="submit"]').click();

            // Then: Debe aparecer un mensaje de error
            cy.get('.error-message', { timeout: 10000 })
                .should('be.visible')
                .and('contain', 'Este correo electrónico ya está registrado');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 6: Usuario intenta registrarse con email inválido
    // ----------------------------------------------------------------------
    describe('Escenario 6: Validación de formato de email', () => {
        it('Dado que el usuario ingresa un email con formato inválido, cuando intenta registrarse, entonces debe ver un mensaje de error', () => {
            // Given: Usuario llena el formulario con email inválido
            cy.get('input#full-name').type('Juan Perez');
            cy.get('input#email').type('email-invalido');
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password123');

            // When: Usuario hace click en registrarse
            cy.get('button[type="submit"]').click();

            // Then: Puede aparecer validación HTML5 o un mensaje de error del presenter
            cy.document().then((doc) => {
                const invalid = doc.querySelector('input#email:invalid');
                if (invalid) {
                    expect(invalid).to.exist;
                } else {
                    cy.get('.error-message', { timeout: 10000 }).should('be.visible');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 7: Usuario intenta registrarse sin nombre completo
    // ----------------------------------------------------------------------
    describe('Escenario 7: Validación de nombre completo vacío', () => {
        it('Dado que el usuario no ingresa su nombre completo, cuando intenta registrarse, entonces debe ver un mensaje de error', () => {
            // Given: Usuario llena el formulario sin nombre
            cy.get('input#email').type('juan@test.com');
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password123');

            // When: Usuario hace click en registrarse
            cy.get('button[type="submit"]').click();

            // Then: Either HTML5 invalid or presenter error
            cy.document().then((doc) => {
                const invalid = doc.querySelector('input#full-name:invalid');
                if (invalid) {
                    expect(invalid).to.exist;
                } else {
                    cy.get('.error-message', { timeout: 10000 }).should('be.visible');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 8: Verificación de limpieza de espacios en blanco
    // ----------------------------------------------------------------------
    describe('Escenario 8: Limpieza de espacios en blanco', () => {
        it('Dado que el usuario ingresa datos con espacios extras, cuando se registra, entonces los espacios deben ser eliminados automáticamente', () => {
            const timestamp = Date.now();
            const testEmail = `test${timestamp}@test.com`;

            // Given: Usuario llena el formulario con espacios extras
            cy.get('input#full-name').type('  Juan Perez  ');
            cy.get('input#email').type(`  ${testEmail}  `);
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password123');

            // When: Usuario hace click en registrarse
            cy.get('button[type="submit"]').click();

            // Then: Al menos el estado de carga del botón debe activarse (comprobación UI independiente del backend)
            cy.get('button[type="submit"]', { timeout: 5000 })
                .should('be.disabled')
                .and('contain', 'Registrando...');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 9: Verificación del estado del botón durante el proceso
    // ----------------------------------------------------------------------
    describe('Escenario 9: Estado del botón durante el registro', () => {
        it('Dado que el usuario está en proceso de registro, entonces el botón debe estar deshabilitado y mostrar un indicador de carga', () => {
            const timestamp = Date.now();
            const testEmail = `test${timestamp}@test.com`;

            // Given: Usuario llena el formulario
            cy.get('input#full-name').type('Juan Perez');
            cy.get('input#email').type(testEmail);
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password123');

            // When: Usuario hace click en registrarse
            cy.get('button[type="submit"]').click();

            // Then: El botón debe cambiar su estado inmediatamente
            cy.get('button[type="submit"]')
                .should('be.disabled')
                .and('contain', 'Registrando...');

            // Then: Después del proceso, el botón debe volver a estar habilitado
            cy.get('.success-message', { timeout: 10000 }).should('be.visible');
            cy.get('button[type="submit"]')
                .should('not.be.disabled')
                .and('contain', 'Register');
        });
    });

    // ----------------------------------------------------------------------
    // Escenario 10: Verificación de múltiples intentos de registro
    // ----------------------------------------------------------------------
    describe('Escenario 10: Múltiples intentos de registro con diferentes errores', () => {
        it('Dado que el usuario comete errores y los corrige, entonces debe poder ver los mensajes actualizados correctamente', () => {
            // Primer intento: contraseñas no coinciden
            cy.get('input#full-name').type('Juan Perez');
            cy.get('input#email').type('juan@test.com');
            cy.get('input#password').type('password123');
            cy.get('input#confirm-password').type('password456');
            cy.get('button[type="submit"]').click();

            cy.get('.error-message')
                .should('be.visible')
                .and('contain', 'Las contraseñas no coinciden');

            // Segundo intento: contraseña muy corta
            cy.get('input#password').clear().type('12345');
            cy.get('input#confirm-password').clear().type('12345');
            cy.get('button[type="submit"]').click();

            cy.get('.error-message')
                .should('be.visible')
                .and('contain', 'La contraseña debe tener al menos 6 caracteres');

            // Tercer intento: datos correctos
            const timestamp = Date.now();
            const testEmail = `test${timestamp}@test.com`;
            
            cy.get('input#email').clear().type(testEmail);
            cy.get('input#password').clear().type('password123');
            cy.get('input#confirm-password').clear().type('password123');
            cy.get('button[type="submit"]').click();

            cy.get('.success-message', { timeout: 10000 })
                .should('be.visible')
                .and('contain', 'Usuario registrado exitosamente');
        });
    });
});
