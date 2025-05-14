# Multi-Language Welcome Application

A modern, feature-rich web application built with React, TypeScript, and Vite, featuring multi-language support, authentication, and a comprehensive dashboard.

## 🚀 Features

- 🌐 Multi-language support with i18next
- 🔐 Authentication system with email verification
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 📱 Responsive design
- 🎯 Interactive onboarding flow
- 📊 Dashboard with analytics
- 🖼️ Image gallery and editor
- 🤖 AI-powered writing assistant
- 📈 Analytics and reporting
- 💳 Billing and subscription management
- 👥 Team collaboration features

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router v6
- React Query
- Framer Motion
- i18next for internationalization
- Various UI libraries (Radix UI, React Joyride, etc.)

### Backend
- Node.js
- Express.js
- MongoDB (based on the project structure)

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd multi-lang-welcome
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
VITE_API_URL=your_api_url
VITE_APP_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
multi-lang-welcome/
├── src/
│   ├── admin-dashboard/    # Admin panel components
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── editor/            # Rich text editor implementation
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and libraries
│   ├── models/            # TypeScript interfaces and types
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── styles/            # Global styles
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── dist/                  # Build output
└── various config files   # Configuration files
```

## 🔑 Key Features Implementation

### Authentication
- Email-based authentication
- OAuth integration
- Protected routes
- Session management

### Multi-language Support
- i18next integration
- Language switching
- RTL support

### Dashboard
- Analytics overview
- Team management
- Content creation tools
- User settings

### Editor
- Rich text editing
- Image manipulation
- Template system
- Export functionality

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with a custom configuration in `tailwind.config.ts`.

### TypeScript
TypeScript configuration is split between:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application-specific configuration
- `tsconfig.node.json` - Node.js specific configuration

### Vite
Vite configuration is in `vite.config.ts` with React and SWC support.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔒 Security

- Protected routes
- CSRF protection
- Secure authentication
- Environment variable management

## 🎨 Theming

- Light theme (default)
- Custom color schemes
- Consistent design system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
