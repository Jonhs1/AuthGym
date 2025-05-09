// frontend/public/js/auth.js

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Função para exibir alertas
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertElement);
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
    }, 5000);
}

// Função para registrar um novo usuário
async function register(nome, email, senha) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao registrar');
        }
        
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showAlert('Cadastro realizado com sucesso!', 'success');
        
        // Redirecionar para o dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// Função para fazer login
async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login');
        }
        
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showAlert('Login realizado com sucesso!', 'success');
        
        // Redirecionar para o dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Função para verificar autenticação
function checkAuth() {
    const token = localStorage.getItem('token');
    const authMenu = document.getElementById('auth-menu');
    const userMenu = document.getElementById('user-menu');
    
    if (token) {
        // Usuário autenticado
        if (authMenu) authMenu.classList.add('d-none');
        if (userMenu) userMenu.classList.remove('d-none');
    } else {
        // Usuário não autenticado
        if (authMenu) authMenu.classList.remove('d-none');
        if (userMenu) userMenu.classList.add('d-none');
    }
}

// Função para obter o token de autenticação
function getAuthToken() {
    return localStorage.getItem('token');
}

// Função para obter dados do usuário do localStorage
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
