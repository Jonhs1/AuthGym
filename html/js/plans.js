// frontend/public/js/plans.js

// URL base da API
const API_URL = 'http://localhost:5000/api';

// Função para exibir alertas
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }
}

// Função para obter token de autenticação
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Verificar se o usuário é admin
function isAdmin() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return userData.isAdmin === true;
}

// Carregar todos os planos para gerenciamento (apenas admin)
async function loadPlansForAdmin() {
  try {
    const token = getAuthToken();
    if (!token || !isAdmin()) {
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch(`${API_URL}/plans`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar planos');
    }

    const plans = await response.json();
    const plansTableBody = document.getElementById('plans-table-body');
    
    if (!plansTableBody) return;
    
    plansTableBody.innerHTML = '';
    
    plans.forEach(plan => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${plan.nome}</td>
        <td>${plan.descricao.substring(0, 50)}${plan.descricao.length > 50 ? '...' : ''}</td>
        <td>R$ ${plan.preco.toFixed(2)}</td>
        <td>${plan.duracaoMeses} meses</td>
        <td>
          <button class="btn btn-sm btn-primary edit-plan" data-id="${plan._id}">Editar</button>
          <button class="btn btn-sm btn-danger delete-plan" data-id="${plan._id}">Excluir</button>
        </td>
      `;
      plansTableBody.appendChild(row);
    });

    // Adicionar event listeners para botões
    document.querySelectorAll('.edit-plan').forEach(button => {
      button.addEventListener('click', () => editPlan(button.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-plan').forEach(button => {
      button.addEventListener('click', () => deletePlan(button.getAttribute('data-id')));
    });

  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// Carregar detalhes de um plano para edição
async function editPlan(planId) {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/plans/${planId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar detalhes do plano');
    }

    const plan = await response.json();
    
    // Preencher formulário de edição
    document.getElementById('plan-id').value = plan._id;
    document.getElementById('plan-name').value = plan.nome;
    document.getElementById('plan-description').value = plan.descricao;
    document.getElementById('plan-price').value = plan.preco;
    document.getElementById('plan-duration').value = plan.duracaoMeses;
    
    // Mostrar modal de edição
    const editModal = new bootstrap.Modal(document.getElementById('edit-plan-modal'));
    editModal.show();

  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// Salvar plano (criar ou atualizar)
async function savePlan(event) {
  event.preventDefault();
  
  try {
    const token = getAuthToken();
    const planId = document.getElementById('plan-id').value;
    
    const planData = {
      nome: document.getElementById('plan-name').value,
      descricao: document.getElementById('plan-description').value,
      preco: parseFloat(document.getElementById('plan-price').value),
      duracaoMeses: parseInt(document.getElementById('plan-duration').value)
    };

    const url = planId ? `${API_URL}/plans/${planId}` : `${API_URL}/plans`;
    const method = planId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao salvar plano');
    }

    // Fechar modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('edit-plan-modal'));
    editModal.hide();
    
    // Recarregar planos
    loadPlansForAdmin();
    showAlert(`Plano ${planId ? 'atualizado' : 'criado'} com sucesso!`, 'success');

  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// Excluir plano
async function deletePlan(planId) {
  if (!confirm('Tem certeza que deseja excluir este plano?')) {
    return;
  }
  
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/plans/${planId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao excluir plano');
    }

    loadPlansForAdmin();
    showAlert('Plano excluído com sucesso!', 'success');

  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
  // Formulário de criação/edição de plano
  const planForm = document.getElementById('plan-form');
  if (planForm) {
    planForm.addEventListener('submit', savePlan);
  }

  // Botão para abrir modal de criar plano
  const newPlanBtn = document.getElementById('new-plan-btn');
  if (newPlanBtn) {
    newPlanBtn.addEventListener('click', () => {
      // Limpar formulário
      document.getElementById('plan-form').reset();
      document.getElementById('plan-id').value = '';
      
      // Abrir modal
      const editModal = new bootstrap.Modal(document.getElementById('edit-plan-modal'));
      editModal.show();
    });
  }

  // Carregar planos na página de admin
  if (window.location.pathname.includes('admin-plans.html')) {
    loadPlansForAdmin();
  }
});
