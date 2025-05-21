# GymSystem

(Ainda esta em desenvolvimento!!)

## 🌐 Arquitetura Física de Implantação

### 1. Visão Geral

O sistema *GymSystem* foi projetado utilizando a arquitetura cliente-servidor e pode ser implantado em ambiente de nuvem moderna com escalabilidade e segurança.

### 2. Componentes e Hospedagem

| Componente               | Hospedagem Sugerida                      |
|--------------------------|------------------------------------------|
| Frontend (HTML/CSS/JS)   | Vercel, Netlify ou servidor estático     |
| Backend (Node.js/Express)| Railway, Heroku ou VPS (DigitalOcean)   |
| Banco de Dados (MongoDB) | MongoDB Atlas (serviço gerenciado na nuvem) |

### 3. Comunicação

- Cliente envia requisições HTTP/HTTPS ao servidor utilizando `fetch` ou bibliotecas como `axios`.
- O servidor Node.js processa a lógica da aplicação e interage com o banco MongoDB.
- As respostas são devolvidas em formato JSON.
- Autenticação pode ser realizada via **JWT (JSON Web Token)**.

### 4. Segurança e Boas Práticas

- Comunicação segura via HTTPS.
- Validação e sanitização de dados no backend.
- Uso de variáveis de ambiente para armazenar dados sensíveis (ex: URIs de conexão, segredos JWT).
- Adoção de middlewares para autenticação e controle de acesso.


## 🏗️ Arquitetura Física – GymSystem
### 1. Componentes
- Cliente (Frontend)	Navegador do usuário acessa o sistema via HTML/CSS/JS na web.
- Servidor de Aplicação (Backend)	Servidor Node.js que processa as requisições, autentica usuários, gerencia dados.
- Banco de Dados	MongoDB para armazenar informações de usuários, planos, pagamentos, etc.

### 2. Hospedagem
- Componente	Local de Hospedagem	
- Aplicação Web	Cloud (e.g., Render, Vercel, Railway) ou servidor VPS (como DigitalOcean)	
- Servidor Node.js	Mesmo local da aplicação web ou container em cloud (Docker, Heroku)	
- Banco de Dados MongoDB	MongoDB Atlas (Cloud), ou servidor próprio (menos recomendado)	

### 3. Comunicação Cliente-Servidor
- O cliente (navegador) envia requisições HTTP/HTTPS via fetch() para o servidor Node.js.

- O servidor processa as requisições, acessa o banco de dados MongoDB (usando Mongoose) e retorna respostas (JSON).

- Autenticação pode ser via token JWT, enviado nos headers.

### 4. Descrição Textual Simplificada
- O sistema GymSystem será implantado em uma arquitetura cliente-servidor. O frontend, desenvolvido com HTML, CSS e JavaScript, será hospedado em um serviço de nuvem como Vercel. O backend (Node.js com Express) será implantado em um servidor cloud como Railway ou Heroku. O banco de dados MongoDB ficará hospedado no serviço gerenciado MongoDB Atlas, garantindo alta disponibilidade e segurança. A comunicação entre o cliente e o servidor será feita por meio de requisições HTTPS usando o padrão REST, com autenticação baseada em tokens JWT.


---

## 🧠 Arquitetura Lógica – *GymSystem*

---

### 🔁 Fluxo Lógico de Funcionamento

1. **Cliente (Browser)**
   Interface gráfica (HTML/CSS/JS) acessada pelo usuário.

2. **Rotas (Express)**
   Recebem e respondem requisições HTTP:

   * `/login`
   * `/register`
   * `/dashboard`
   * `/subscription`

3. **Controladores (Controllers)**
   Executam a lógica de negócio:

   * Autenticam usuários
   * Validam dados
   * Chamam os modelos

4. **Modelos (Mongoose)**
   Representam os dados e interagem com o MongoDB:

   * `User`
   * `Subscription`

5. **Banco de Dados (MongoDB)**
   Armazena as informações persistentes:

   * Usuários
   * Planos
   * Sessões

---

### 📄 Diagrama Lógico Textual

```
[ Usuário (Navegador) ]
           ↓
      [ Rotas Express ]
           ↓
    [ Controllers (JS) ]
           ↓
   [ Modelos (Mongoose) ]
           ↓
      [ MongoDB Atlas ]
```

---

### 🔎 Componentes e Responsabilidades

| Camada        | Responsabilidade Principal                                |
| ------------- | --------------------------------------------------------- |
| Cliente       | Interface do sistema. Envia dados via formulários.        |
| Rotas         | Encaminham as requisições para os controladores corretos. |
| Controladores | Validam e processam a lógica principal da aplicação.      |
| Modelos       | Interagem diretamente com o banco usando Mongoose.        |
| MongoDB       | Armazena dados dos usuários e assinaturas.                |

---

