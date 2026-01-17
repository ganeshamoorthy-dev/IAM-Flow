# 🛡️ IAM Flow - React + TypeScript + Vite

A comprehensive Identity and Access Management (IAM) frontend application built with React, TypeScript, and Vite, featuring a robust service layer for JWT authentication and role-based access control.

## 🚀 Features

- **Complete IAM Flow**: Account creation, user onboarding, role management, and authentication
- **JWT Authentication**: Automatic token management with axios interceptors
- **Role-Based Access Control**: Comprehensive permission system
- **TypeScript**: Full type safety with strict typing
- **React Integration**: Custom hooks for seamless React component integration
- **Material-UI**: Modern and responsive UI components
- **Form Validation**: React Hook Form with Yup validation
- **Error Handling**: Comprehensive error handling and user feedback

## 📋 IAM Service Layer

This project includes a complete service layer implementation for the IAM API flow. For detailed documentation, see [SERVICE_LAYER_README.md](./SERVICE_LAYER_README.md).

### Quick Start with Service Layer

```typescript
import { accountService } from './src/services';

// Create account and authenticate
const account = await accountService.createAccount({
  name: 'My Organization',
  description: 'Test account',
  type: 'ORGANIZATION'
});

// Login
await accountService.rootLogin({
  email: 'admin@example.com',
  password: 'password'
});

// Check authentication
if (accountService.isAuthenticated()) {
  console.log('User is authenticated');
}
```

## 🛠️ Installation

```bash
npm install
```

## 🔧 Environment Setup

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_DEV_MODE=true
```

## 🚀 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📚 API Documentation

The service layer supports the following IAM flow:

1. **Create Account** → Get account ID
2. **Create Root User** → Register administrator
3. **OTP Validation** → Verify email
4. **Set Password** → Set user credentials
5. **Authentication** → Get JWT token
6. **Create Roles** → Define permissions
7. **Create Users** → Add team members
8. **Role Assignment** → Assign permissions
9. **Access Testing** → Verify role-based access

For complete API documentation and examples, see [SERVICE_LAYER_README.md](./SERVICE_LAYER_README.md).

## 🧰 Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI** - UI components
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **React Router** - Routing

## 🔒 Security Features

- JWT token automatic management
- Request/response interceptors
- Error handling and user feedback
- Role-based route protection
- Secure token storage

## 📖 Usage Examples

### React Component Integration

```tsx
import React from 'react';
import { useIamService } from './hooks/useIamService';

const LoginForm: React.FC = () => {
  const { login, loading, error } = useIamService();

  const handleSubmit = async (data: LoginFormData) => {
    const success = await login({
      email: data.email,
      accountId: data.accountId,
      password: data.password
    });
    
    if (success) {
      // Handle successful login
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## 🎯 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API service layer
│   ├── ApiClient.ts    # Axios configuration
│   ├── AccountService.ts # IAM service
│   └── index.ts        # Exports
├── models/             # TypeScript interfaces
│   ├── request/        # Request DTOs
│   ├── response/       # Response DTOs
│   └── common/         # Common types
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
└── router/             # Routing configuration
```

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
