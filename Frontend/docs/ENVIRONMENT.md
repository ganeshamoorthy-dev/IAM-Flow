# Environment Configuration

This document explains how to configure environment variables for the IAM Flow application using the `env/` folder structure.

## Environment Files Structure

The application uses environment-specific configuration files located in the `env/` directory:

```
env/
├── .env-development     # Development environment template
├── .env-production      # Production environment template
└── .env                 # Active environment file (auto-generated, gitignored)
```

## Environment File Loading

Vite automatically loads environment files from the `env/` directory in this order:
1. `env/.env-{mode}`     # Environment-specific file
2. `env/.env`            # Default environment file

## Available Environment Variables

### API Configuration
- `VITE_API_BASE_URL` - Base URL for the API (e.g., `http://localhost:8080/api/v1`)
- `VITE_API_TIMEOUT` - Request timeout in milliseconds (default: 30000)
- `VITE_API_RETRIES` - Number of retry attempts (default: 3)
- `VITE_API_VERSION` - API version (default: v1)

### Application Configuration
- `VITE_APP_ENV` - Application environment (development/production)
- `VITE_USE_MOCK` - Enable mock data (true/false)
- `VITE_ENABLE_LOGGING` - Enable service logging (true/false)

### Development Configuration
- `VITE_DEV_TOOLS` - Enable development tools (true/false)

## Setup Commands

### Quick Setup with Auto-Run
```bash
# Development environment + start dev server
npm run dev:setup

# Production environment + build
npm run build:setup
```

### Manual Environment Setup
```bash
# Set up development environment
npm run env:dev

# Set up production environment
npm run env:prod

# Custom setup (copies from env/.env-{environment})
npm run env:setup development
```

### Standard Development Workflow
```bash
# Start development (uses development mode automatically)
npm run dev

# Build for production (uses production mode automatically)
npm run build

# Build for development
npm run build:dev
```

## Environment File Management

### Creating New Environment Files
1. Create a new file in `env/` directory: `env/.env-{environment}`
2. Copy content from existing environment file
3. Modify values as needed
4. Use with: `npm run env:setup {environment}`

### Environment File Priority
1. **Development Mode**: `env/.env-development` → `env/.env`
2. **Production Mode**: `env/.env-production` → `env/.env`
3. **Custom Mode**: `env/.env-{mode}` → `env/.env`

## Usage in Code

The configuration is managed by the `ConfigService` singleton:

```typescript
import { configService } from '@/services/config/ConfigService';

// Get base URL (automatically reads from env/directory)
const baseUrl = configService.getBaseUrl();

// Check if using mock data
const useMock = configService.useMockData();

// Check environment
const isDev = configService.isDevelopment();
```

## Development Workflow

### Local Development
```bash
# Setup and start development
npm run dev:setup
# or manually:
npm run env:dev
npm run dev
```

### Production Build
```bash
# Setup and build for production
npm run build:setup
# or manually:
npm run env:prod
npm run build
```

### Environment Switching
```bash
# Switch to development
npm run env:dev

# Switch to production
npm run env:prod

# Check current environment
cat env/.env | grep VITE_APP_ENV
```

## File Structure Benefits

✅ **Centralized**: All environment files in one location  
✅ **Version Controlled**: Template files (.env-development, .env-production) are committed  
✅ **Gitignored**: Active .env file is automatically ignored  
✅ **Mode-Aware**: Vite automatically selects correct environment based on mode  
✅ **Script Integration**: NPM scripts handle environment setup automatically  

## Troubleshooting

### Environment Variables Not Loading
1. Check if `env/.env` exists: `ls env/.env`
2. Verify environment setup: `npm run env:dev`
3. Check variable prefix: Must start with `VITE_`
4. Restart development server after env changes

### Wrong Environment Active
1. Check current environment: `npm run env:setup`
2. Manually set environment: `npm run env:dev` or `npm run env:prod`
3. Clear browser cache and restart dev server

### Missing Environment Files
1. Check available environments: `ls env/.env-*`
2. Create missing environment file from template
3. Run setup script: `npm run env:setup {environment}`

## Notes

- All environment variables must be prefixed with `VITE_` to be accessible in the client
- The `env/.env` file is gitignored and should not be committed
- Environment template files in `env/` directory are committed for reference
- Vite's `envDir` is configured to use the `env/` directory
- Default values are provided in `ConfigService.ts` as fallbacks
