# bolabaden: Boden Crouch Portfolio & Infrastructure Platform

Welcome to **bolabaden**—a dual-purpose, production-grade platform that serves as both the professional portfolio of Boden Crouch and a comprehensive, live management interface for self-hosted infrastructure, Kubernetes, AI tools, and backend development. bolabaden is built with Next.js 14, TypeScript, and Tailwind CSS, and is designed to be both a personal branding site and a living, operational demonstration of modern cloud-native engineering.

---

## Overview

bolabaden is:

- **A Professional Portfolio**: Showcasing Boden Crouch’s technical expertise, project history, open source contributions, and professional philosophy. Includes detailed case studies, project writeups, and a dynamic, interactive resume.
- **A Live Infrastructure Platform**: Real-time dashboards and management for self-hosted and cloud-native services, including Kubernetes clusters, AI/ML workloads, CI/CD pipelines, and backend systems. Features live service status, monitoring, and technical documentation.

## Project Structure

```shell
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles and theme
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main homepage
├── components/            # React components
│   ├── hero-section.tsx   # Hero with professional intro
│   ├── technical-showcase.tsx  # Infrastructure & services
│   ├── projects-section.tsx    # Project portfolio
│   ├── guides-section.tsx      # Technical guides
│   ├── about-section.tsx       # About and skills
│   ├── contact-section.tsx     # Contact information
│   ├── navigation.tsx          # Main navigation
│   ├── section.tsx            # Reusable section wrapper
│   └── footer.tsx             # Site footer
├── lib/                   # Utilities and data
│   ├── utils.ts           # Utility functions
│   ├── types.ts           # TypeScript interfaces
│   └── data.ts            # Portfolio content
└── public/                # Static assets
```

- **/app**: Next.js App Router pages, layouts, and server components
- **/components**: Reusable React components and UI primitives
- **/lib**: Utility functions, API clients, and shared logic
- **/styles**: Tailwind CSS configuration and global styles
- **/public**: Static assets (images, icons, etc.)
- **/docs**: Technical guides, documentation, and markdown content
- **/infrastructure**: IaC scripts, Kubernetes manifests, and deployment configs
- **/scripts**: Automation, CI/CD, and maintenance scripts

---

## Features

- **Modern, Professional Design**: Clean, minimalist dark theme with glassmorphism, custom branding, and accessibility in mind.
- **Live Technical Showcase**: Real-time infrastructure monitoring, service status, architecture diagrams, and live metrics for Kubernetes, Docker, and cloud-native services.
- **Project Portfolio**: Featured projects with GitHub integration, live demos, technology stack highlights, and detailed writeups.
- **Technical Guides & Documentation**: Step-by-step guides for self-hosted services, infrastructure-as-code, Kubernetes deployments, and DevOps workflows.
- **Professional About & Resume**: Authentic representation of skills, experience, certifications, and work philosophy, with downloadable resume and LinkedIn integration.
- **Contact & Availability**: Multiple communication channels, live availability status, and pre-filled contact templates for easy outreach.
- **Responsive & Accessible**: Optimized for desktop and mobile, with a focus on accessibility and performance.
- **SEO & Performance**: Proper metadata, static site generation, image optimization, and best-in-class performance.
- **Open Source**: MIT licensed, open for contributions, issues, and feedback. Community-driven improvements welcome.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components, Static & Dynamic Rendering)
- **Language**: TypeScript (strict mode, type-safe throughout)
- **Styling**: Tailwind CSS with a custom design system and utility-first approach
- **Animations**: Framer Motion for smooth, modern UI transitions and microinteractions
- **Icons**: Lucide React for consistent, scalable iconography
- **State Management**: React Context, Zustand, and SWR for data fetching and state
- **API & Backend**: REST/GraphQL endpoints, edge functions, and integrations with self-hosted services
- **Deployment**: Docker containerization, multi-stage builds, standalone output, and CI/CD pipelines (GitHub Actions)
- **Monitoring & Observability**: Prometheus, Grafana, and custom dashboards for live metrics and alerting
- **Infrastructure**: Kubernetes (k3s/k8s), Traefik/NGINX, self-hosted GitHub Actions runners, and IaC (Terraform/Ansible)
- **AI/ML Integration**: Self-hosted LLMs, inference endpoints, and AI-powered features

---

## Deploy locally

1. Clone the repo

   ```bash
   git clone https://github.com/bolabaden/bolabaden-site.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

```bash
docker build -t bolabaden-portfolio .
docker run -p 3000:3000 bolabaden-portfolio
```

## Configuration

### Content Management

All portfolio content is managed through the `lib/data.ts` file:

- **Services**: Infrastructure and hosted services
- **Projects**: Portfolio projects with GitHub links
- **Guides**: Technical documentation and tutorials
- **Tech Stack**: Skills and experience levels
- **Contact Info**: Professional contact details

### Styling

The design system is built with Tailwind CSS and includes:

- **Custom Color Palette**: Professional dark theme
- **Typography**: Optimized font stack with JetBrains Mono
- **Components**: Reusable UI components with consistent styling
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## Key Features

### Technical Showcase

- Live service status monitoring
- Infrastructure architecture overview
- Real-time performance metrics
- Service categorization and filtering

### Project Portfolio

- Featured project highlights
- Technology stack integration
- GitHub repository links
- Live demo accessibility

### Technical Guides

- Comprehensive infrastructure documentation
- Step-by-step deployment guides
- Difficulty-based categorization
- Prerequisites and technology requirements

### Professional About

- Authentic technical background
- Self-taught expertise emphasis
- Work preferences and communication style
- Skills visualization with experience levels

### Contact Integration

- Multiple communication channels
- Professional availability status
- Work preference specifications
- Pre-filled contact templates

## Performance Optimization

- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loading
- **SEO Optimization**: Comprehensive metadata and social sharing
- **Accessibility**: WCAG 2.1 compliance with proper focus management

## Deployment

The application is designed for deployment with Docker and includes:

- **Multi-stage Dockerfile**: Optimized for production builds
- **Standalone Output**: Reduced image size with Next.js standalone mode
- **Environment Variables**: Configurable runtime settings
- **Health Checks**: Application health monitoring

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Contact

- **Email**: <webmaster@bolabaden.org>

Built using Next.js, TypeScript, and Tailwind CSS.

- **GitHub**: [https://github.com/bolabaden](https://github.com/bolabaden)
- **Website**: [https://bolabaden.org](https://bolabaden.org)

## License

This project is open source and available under the [MIT License](LICENSE).
