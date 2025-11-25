import { registerUser } from './signing_up.js';

export class RegistrationPresenter {
  constructor() {
    this.form = null;
    this.fullNameInput = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.confirmPasswordInput = null;
    this.submitButton = null;
  }

  /**
   * Inicializa el presenter vinculando elementos del DOM y eventos
   */
  init() {
    this.form = document.getElementById('registration-form');
    this.fullNameInput = document.getElementById('full-name');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.confirmPasswordInput = document.getElementById('confirm-password');
    this.submitButton = this.form.querySelector('button[type="submit"]');

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  /**
   * Maneja el evento de envío del formulario
   */
  async handleSubmit(event) {
    event.preventDefault();

    const fullName = this.fullNameInput.value.trim();
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    // Deshabilitar botón durante el proceso
    this.setLoading(true);
    this.clearMessages();

    try {
      const result = await registerUser(fullName, email, password, confirmPassword);
      // Expose created user id for E2E cleanup
      try { window.__LAST_CREATED_USER_ID = result.uid; } catch (e) { /* ignore in non-browser env */ }
      this.showSuccess(result.message);
      this.form.reset();
      
      // Redirigir después de 2 segundos a la página principal de la app
      setTimeout(() => {
        window.location.href = '/src/Match/match.html';
      }, 2000);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Muestra un mensaje de error
   */
  showError(message) {
    this.clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error-message';
    errorDiv.textContent = message;
    this.form.insertBefore(errorDiv, this.form.firstChild);
  }

  /**
   * Muestra un mensaje de éxito
   */
  showSuccess(message) {
    this.clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'message success-message';
    successDiv.textContent = message;
    this.form.insertBefore(successDiv, this.form.firstChild);
  }

  /**
   * Limpia los mensajes anteriores
   */
  clearMessages() {
    const messages = this.form.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
  }

  /**
   * Activa/desactiva el estado de carga
   */
  setLoading(isLoading) {
    if (this.submitButton) {
      this.submitButton.disabled = isLoading;
      this.submitButton.textContent = isLoading ? 'Registrando...' : 'Crear Cuenta';
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const presenter = new RegistrationPresenter();
  presenter.init();
});
