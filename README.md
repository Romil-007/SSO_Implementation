## 🔐 SSO Implementation using Azure Active Directory

This repository contains the codebase for implementing **Single Sign-On (SSO)** using **Azure Active Directory (Azure AD)** as part of an internship project in collaboration with **Harrier Information Systems**.

### 📌 Project Overview

The goal of this project is to integrate secure and seamless authentication for a web application using Azure AD. This allows users to log in with their organizational Microsoft credentials without needing separate app-specific accounts.

### 🧑‍💻 Team Members

- [Romil Pandey](https://github.com/Romil-007)
- [Sakshi Kore](https://github.com/sakshikore16)
- [Shah Areeb](https://github.com/Areeb-7)
- [Karunesh Chikne](https://github.com/karunesh-28)

### 🚀 Features

- 🔐 Azure Active Directory (AD) SSO integration
- 📲 OAuth 2.0 & OpenID Connect protocol usage
- 👨‍💼 Secure role-based access
- ⚙️ Configurable redirect URIs
- 📦 Scalable architecture for enterprise use

### 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Azure AD** | Identity Provider (IdP) |
| **Node.js / Express** | Backend API |
| **React / HTML** | Frontend interface |
| **MSAL.js / Passport-Azure-AD** | Authentication libraries |
| **Visual Studio Code** | Development environment |


### 🔧 Setup Instructions

#### 1. Clone the repo

```bash
git clone https://github.com/Romil-007/SSO_Implementation.git
cd SSO_Implementation
```

**2. Configure Azure AD & Google OAuth**

- Go to [Azure Portal](https://portal.azure.com/)
    - Register an app and generate:
        - **Azure Tenant ID**
        - **Azure Client ID**
        - **Azure Client Secret**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
    - Set up OAuth 2.0 credentials and generate:
        - **Google Client ID**
        - **Google Client Secret**
    - Set the **Redirect URI** to:
        - `http://localhost:5001`

**3. Update .env Files**

➡️ **In client/.env**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:5001
```
➡️ **In server/.env**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001
SESSION_SECRET=your_custom_session_secret
PORT=5001
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

**4. Install Dependencies**
**Backend**
```bash
cd server
npm install
```
**Frontend**
```bash
cd ../client
npm install
```

**5. Run the Application**
**Start backend**
```bash
cd ../server
npm start
```
**Start frontend**
```bash
cd ../client
npm start
```
### 📖 Documentation
**You can access the full documentation for this project here:**

**[SSO Implementation Documentation](https://docs.google.com/document/d/1hlJzxz_INRbl-E4-N-3oU1iLJJUvg5LqVUdAhHt2J54/edit?usp=sharing)**

##

## Thank You

