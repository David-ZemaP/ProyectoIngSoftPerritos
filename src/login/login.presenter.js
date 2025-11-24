import { loginUser } from './login.js';

export class LoginPresenter {
  constructor() {
    this.form = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.submitButton = null;
  }

  /**
   * Inicializa el presenter vinculando elementos del DOM y eventos
   */
  init() {
    this.form = document.getElementById('login-form');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
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

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    // Deshabilitar botón durante el proceso
    this.setLoading(true);
    this.clearMessages();

    try {
      const result = await loginUser(email, password);
      this.showSuccess(result.message);
      this.form.reset();
      
      // Redirigir después de 1 segundo a la página principal de la app
      setTimeout(() => {
        window.location.href = '../Match/match.html';
      }, 1000);
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
      this.submitButton.textContent = isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión';
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const presenter = new LoginPresenter();
  presenter.init();
});
