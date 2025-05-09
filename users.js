// frontend/public/js/users.js

// Função para carregar perfil do usuário
async function loadUserProfile() {
    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
  
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Falha ao carregar perfil');
      }
  
      const userData = await response.json();
      
      // Exibir dados do usuário
      document.getElementById('user-name').textContent = userData.nome;
      document.getElementById('user-email').textContent = userData.email;
      
      // Exibir informações de assinatura se existir
      if (userData.assinatura && userData.assinatura.plano) {
        document.getElementById('subscription-info').classList.remove('d-none');
        document.getElementById('plan-name').textContent = userData.assinatura.plano.nome;
        document.getElementById('plan-expiry').textContent = new Date(userData.assinatura.dataExpiracao).toLocaleDateString('pt-BR');
      } else {
        document.getElementById('no-subscription').classList.remove('d-none');
      }
  
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Função para carregar planos disponíveis
  async function loadPlans() {
    try {
      const plansContainer = document.getElementById('plans-container');
      if (!plansContainer) return;
  
      const response = await fetch(`${API_URL}/plans`);
      if (!response.ok) {
        throw new Error('Falha ao carregar planos');
      }
  
      const plans = await response.json();
  
      plansContainer.innerHTML = '';
      plans.forEach(plan => {
        const planCard = document.createElement('div');
        planCard.className = 'col-md-4 mb-4';
        planCard.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${plan.nome}</h5>
              <p class="card-text">${plan.descricao}</p>
              <p class="card-text"><strong>Preço:</strong> R$ ${plan.preco.toFixed(2)}/mês</p>
              <p class="card-text"><strong>Duração:</strong> ${plan.duracaoMeses} meses</p>
              <a href="subscription.html?id=${plan._id}" class="btn btn-primary">Assinar</a>
            </div>
          </div>
        `;
        plansContainer.appendChild(planCard);
      });
  
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Função para carregar detalhes de um plano específico
  async function loadPlanDetails() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const planId = urlParams.get('id');
      
      if (!planId) {
        window.location.href = 'index.html';
        return;
      }
  
      const response = await fetch(`${API_URL}/plans/${planId}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar detalhes do plano');
      }
  
      const plan = await response.json();
  
      // Preencher detalhes do plano
      document.getElementById('plan-name').textContent = plan.nome;
      document.getElementById('plan-description').textContent = plan.descricao;
      document.getElementById('plan-price').textContent = `R$ ${plan.preco.toFixed(2)}/mês`;
      document.getElementById('plan-duration').textContent = `${plan.duracaoMeses} meses`;
      document.getElementById('plan-id').value = plan._id;
  
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Função para assinar um plano
  async function subscribeToPlan(event) {
    event.preventDefault();
    
    try {
      const token = getAuthToken();
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
  
      const planId = document.getElementById('plan-id').value;
      
      const response = await fetch(`${API_URL}/users/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao assinar plano');
      }
  
      showAlert('Plano assinado com sucesso!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
  
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
  
  // Evento para formulário de assinatura
  document.addEventListener('DOMContentLoaded', function() {
    const subscriptionForm = document.getElementById('subscription-form');
    if (subscriptionForm) {
      loadPlanDetails();
      subscriptionForm.addEventListener('submit', subscribeToPlan);
    }
  
    // Carregar perfil do usuário na página dashboard
    if (window.location.pathname.includes('dashboard.html')) {
      loadUserProfile();
    }
  });