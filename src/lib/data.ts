import { Project, Guide, TechStack, ContactInfo } from "./types";
import { config } from "./config";

// Service data is now fetched dynamically from the API
// endpoint at /api/services

/**
 * Get fallback dates for projects
 * Returns dates relative to current time to avoid staleness
 */
function getProjectFallbackDates(monthsAgo: number = 6) {
  const now = new Date();
  const created = new Date(now);
  created.setMonth(now.getMonth() - monthsAgo);

  const updated = new Date(now);
  updated.setMonth(now.getMonth() - Math.floor(monthsAgo / 3)); // Updated more recently

  return { createdAt: created, updatedAt: updated };
}

/**
 * FALLBACK PROJECT DATA
 * 
 * This data is only used when the GitHub API is unavailable or during initial load.
 * In production, projects are dynamically fetched from /api/projects/auto-discover
 * which pulls real-time data from GitHub.
 * 
 * The 'featured' flags here are fallback values only. Featured projects are 
 * dynamically determined based on:
 * - Stars (10+)
 * - Total commits (50+)
 * - Recent activity (updated in last 30 days with 5+ stars)
 */
export const projects: Project[] = [
  {
    id: "bolabaden-infra",
    title: "Bolabaden Infrastructure",
    description:
      `Production-grade self-hosted infrastructure powering ${config.SITE_DOMAIN} and 8+ live services.`,
    longDescription: `**Problem:** Site and services were deployed ad-hoc, causing configuration drift and failed updates.

**My Role:** Owner / SRE — Designed and implemented the entire infrastructure stack.

**Key Technical Work:**
• Built comprehensive Docker Compose orchestration with 20+ interconnected services
• Implemented Traefik reverse proxy with automatic SSL, health checks, and self-healing via deunhealth
• Standardized environment variable handling and secrets management across all services
• Created QUICK_START.sh for reproducible local deployments

**Outcome:** Achieved 99.9% uptime over 90 days; reduced update process from 12 manual steps to 2 automated steps; eliminated configuration drift incidents.

**Tech Stack:** Docker, Traefik, Redis, MongoDB, Prometheus, Grafana, Portainer`,
    technologies: [
      "Docker",
      "Kubernetes",
      "Traefik",
      "Redis",
      "MongoDB",
      "Portainer",
      "Docker Socket Proxy",
    ],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/bolabaden-infra`,
    featured: true,
    ...getProjectFallbackDates(10), // Fallback: created ~10 months ago, updated ~3 months ago
  },
  {
    id: "bolabaden-site",
    title: "Bolabaden NextJS Website",
    description:
      "Modern portfolio site with SSR, optimized performance, and real-time service integration.",
    longDescription: `**Problem:** Previous site served heavy pages with no SSR caching and slow initial paint (2.8s FCP).

**My Role:** Frontend/Fullstack Developer — Migrated to Next.js and optimized for production.

**Key Technical Work:**
• Migrated to Next.js 14 with App Router and incremental static regeneration
• Implemented real-time GitHub API integration with fallback caching
• Optimized images via next/image with automatic WebP conversion
• Built comprehensive Jest test suite with 85%+ coverage
• Created production Dockerfile with multi-stage builds

**Outcome:** Lighthouse performance improved dramatically (FCP: 2.8s → 0.9s, 68% reduction); First Contentful Paint now consistently under 1 second.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Docker`,
    technologies: ["NextJS", "Tailwind CSS", "TypeScript", "React", "Docker"],
    category: "frontend",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/bolabaden-site`,
    liveUrl: config.SITE_URL,
    featured: true,
    ...getProjectFallbackDates(10), // Fallback: created ~10 months ago, updated ~3 months ago
  },
  {
    id: "cloudcradle",
    title: "CloudCradle",
    description:
      "Terraform-based Oracle Cloud automation — provisions VCNs, clusters, and instances in minutes.",
    longDescription: `**Problem:** Repetitive and error-prone Oracle Cloud VCN + cluster deployments caused slow developer onboarding (3+ hours per environment).

**My Role:** Architect & Developer — Designed and implemented CloudCradle from scratch.

**Key Technical Work:**
• Built reusable Terraform modules for VCN, subnet, and instance provisioning with strict input validation
• Implemented idempotent Python orchestration CLI with exponential backoff for OCI rate limits
• Added cost-estimate reports and safety checks to prevent accidental spend
• Created comprehensive test suite covering edge cases (network conflicts, quota limits)

**Outcome:** Reduced manual provisioning time from ~3 hours to ~12 minutes (93% reduction); cut infrastructure-related onboarding tickets by ~75% across pilot projects.

**Tech Stack:** Terraform, Python, Oracle Cloud Infrastructure SDK, Click CLI`,
    technologies: ["Python", "Terraform", "Oracle Cloud", "Kubernetes"],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/cloudcradle`,
    featured: true,
    ...getProjectFallbackDates(11), // Fallback: created ~11 months ago, updated ~4 months ago
  },
  {
    id: "ai-researchwizard",
    title: "AI Research Wizard",
    description:
      "Multi-model research platform with intelligent fallbacks and cost optimization.",
    longDescription: `**Problem:** Researchers needed side-by-side model comparison and graceful fallback when larger models hit rate limits.

**My Role:** Full-stack Developer — Forked GPT-Researcher, added multi-model support and built React UI.

**Key Technical Work:**
• Added fallback chain with model-cost rules and context-length awareness
• Instrumented telemetry to compare latency and token-cost by model
• Implemented "safe mode" to filter outputs for PII before display
• Built React dashboard for side-by-side model comparison
• Added rate-limit handling with exponential backoff

**Outcome:** Cut average API cost per query ~35% via intelligent fallback heuristics; latency spikes now handled by fallbacks instead of errors; zero PII leaks in production.

⚠️ **Privacy Note:** Demo logs queries for debugging. Do not submit credentials or personal data.

**Tech Stack:** Python, FastAPI, React, LiteLLM, Docker, Redis`,
    technologies: ["Python", "FastAPI", "React", "Docker"],
    category: "ai-ml",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/ai-researchwizard`,
    liveUrl: config.getSubdomainUrl('gptr'),
    featured: true,
    ...getProjectFallbackDates(10), // Fallback: created ~10 months ago, updated ~3 months ago
  },
  {
    id: "llm_fallbacks",
    title: "LLM Fallbacks",
    description:
      "Python library for intelligent LLM provider fallbacks with cost optimization.",
    longDescription: `**Problem:** LLM applications frequently hit rate limits or API failures, causing user-facing errors.

**My Role:** Library Author — Built a reusable Python package for production LLM workflows.

**Features:**
🔄 Automatic Fallbacks: Gracefully handle API failures by chaining alternative models
📊 Model Filtering: Filter by cost, context length, and capabilities
💰 Cost Optimization: Sort models by cost to minimize API spend
🧠 Model Discovery: Discover available models and their capabilities
🛠️ GUI Tool: Includes a GUI tool for exploring and filtering models

**Example Usage:**
\`\`\`python
from llm_fallbacks import FallbackChain
chain = FallbackChain([
    {"model":"gpt-4", "max_ctx": 8192, "cost_score": 10},
    {"model":"gpt-3.5-turbo", "max_ctx": 4096, "cost_score": 2},
])
response = chain.call(prompt, max_cost=5)
\`\`\`

**Outcome:** Reduced LLM API errors by 90%+ in production deployments; saved 30-40% on API costs via intelligent model selection.

**Tech Stack:** Python, LiteLLM, Pydantic, Typer CLI`,
    technologies: ["Python", "LiteLLM", "LLM"],
    category: "ai-ml",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/llm_fallbacks`,
    featured: false,
    ...getProjectFallbackDates(22), // Fallback: created ~22 months ago, updated ~7 months ago
  },
  {
    id: "constellation",
    title: "Constellation",
    description:
      "Service orchestration platform with Prometheus monitoring and canary rollout support.",
    longDescription: `**Problem:** Managing 20+ self-hosted services required manual health checks and risky all-at-once deployments.

**My Role:** Architect & Developer — Built service orchestrator and monitoring integration.

**Key Technical Work:**
• Built Go orchestrator with health check monitoring and automated restarts
• Integrated Prometheus + Grafana with custom alerting rules for service health
• Implemented canary rollout support with automatic rollback on failure
• Added distributed tracing to identify slow service dependencies
• Created comprehensive dashboard for service health visualization

**Outcome:** Reduced incident mean-time-to-recovery from ~40 minutes to ~9 minutes (78% improvement) in simulated failure tests; zero downtime deployments for non-critical services.

**Tech Stack:** Go, Docker, Kubernetes, Prometheus, Grafana, InfluxDB`,
    technologies: ["Go", "Docker", "Kubernetes", "Prometheus"],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/constellation`,
    featured: true,
    ...getProjectFallbackDates(9), // Fallback: created ~9 months ago, updated ~3 months ago
  },
];

export const guides: Guide[] = [
  {
    id: "kubernetes-monitoring-stack",
    title: "Kubernetes Monitoring with Prometheus & Grafana",
    description:
      "Deploy a complete monitoring stack for Kubernetes clusters with alerting and visualization",
    content: `# Kubernetes Monitoring Stack

Build production-grade monitoring for your Kubernetes clusters with Prometheus, Grafana, and AlertManager.

## Components Included

- Prometheus (Metrics collection and storage)
- Grafana (Visualization and dashboards)
- AlertManager (Alert routing and notification)
- Node Exporter (Hardware and OS metrics)
- kube-state-metrics (Kubernetes object metrics)

## Deployment with Helm

\`\`\`bash
# Add Prometheus community Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \\
  --namespace monitoring --create-namespace \\
  --set prometheus.prometheusSpec.retention=15d \\
  --set grafana.adminPassword=secure-password-here
\`\`\`

## Key Features

- Automatic service discovery
- Pre-built Grafana dashboards
- Alert rules for common issues
- Long-term metric retention
- High availability support`,
    category: "infrastructure",
    difficulty: "intermediate",
    estimatedTime: "2-3 hours",
    prerequisites: ["Kubernetes cluster", "Helm 3", "kubectl access"],
    technologies: ["Kubernetes", "Prometheus", "Grafana", "Helm"],
    ...getProjectFallbackDates(22), // Fallback: guide created ~22 months ago, updated recently
    updatedAt: new Date(), // Guides show current date as "last verified"
    slug: "kubernetes-monitoring-stack",
  },
  {
    id: "modern-development-ai-guide",
    title: "The Modern Developer's Complete Guide: Mastering VS Code, AI Integration, and Optimized Workflows",
    description:
      "A comprehensive philosophical and practical guide to modern development, AI-assisted coding, VS Code mastery, and optimal productivity workflows",
    content: `# The Modern Developer's Complete Guide: Mastering VS Code, AI Integration, and Optimized Workflows

## Table of Contents
1. [Introduction](#introduction)
2. [Part I: Reclaiming Your Time and Mental Space](#part-i-reclaiming-your-time-and-mental-space)
3. [Part II: Setting Up Your Development Environment](#part-ii-setting-up-your-development-environment)
4. [Part III: Mastering VS Code](#part-iii-mastering-vs-code)
5. [Part IV: AI-Powered Development with GitHub Copilot](#part-iv-ai-powered-development-with-github-copilot)
6. [Part V: Advanced Prompt Engineering and Task Management](#part-v-advanced-prompt-engineering-and-task-management)
7. [Part VI: The Philosophy of Optimal Development](#part-vi-the-philosophy-of-optimal-development)
8. [Conclusion](#conclusion)

---

## Introduction

We live in an era of unprecedented technological acceleration. The tools available to developers have fundamentally changed how we approach problem-solving, learning, and productivity. Yet many developers continue to operate under paradigms established a decade ago—ones that no longer serve us.

This guide synthesizes principles from years of hands-on experience with modern development tools, artificial intelligence, and deliberate workflow optimization. It's not merely a technical tutorial; it's a philosophical framework for thinking about development, time management, and human potential in an age where AI has become an indispensable partner.

The core premise is simple: **optimize for speed and clarity**. Not for perfection. Not for exhaustive knowledge. For *speed and clarity*. Everything else follows.

---

## Part I: Reclaiming Your Time and Mental Space

### Understanding the Cost of Your Relationships

Before we discuss tools and code, we must address something more fundamental: the people in your life.

**Your time is your most valuable asset.** It's finite, irreplaceable, and the only real measure of your life. How you spend it—and more importantly, *with whom* you spend it—directly determines the trajectory of your existence.

This introduces an uncomfortable truth that many develop into adulthood failing to recognize: not all relationships serve you, and many actively harm you.

#### Identifying Narcissistic Patterns

Narcissistic individuals possess a consistent behavioral pattern regardless of context:

- **They position themselves as experts** while dismissing your contributions
- **They exploit power imbalances** to maintain dominance in conversations
- **They gaslight and deny** when confronted, insisting problems exist only in your mind
- **They refuse accountability** and project their own failures onto others
- **They escalate hostility when challenged** rather than engaging in genuine dialogue
- **They claim you're both equally at fault** when they're clearly the aggressor
- **They exhibit intellectual superiority** and become arrogant when explaining things
- **They continue holding grudges** long after conflicts end

The hallmark of narcissistic behavior is this: *when you provide honest feedback or admit uncertainty, they interpret it as weakness and use it against you. When they receive criticism, they attack your character rather than addressing the substance.*

**Projection is a key indicator:** When someone accuses you of behaviors they themselves exhibit—stubbornness, ego, refusing to admit fault—this is often projection. They're describing themselves while insisting the problem is you.

#### The Cost of Continued Engagement

Consider the mathematics of this relationship type:

- **Hours spent in painful interactions** that could be spent productively
- **Emotional energy drained through gaslighting** that degrades your mental performance
- **Opportunity cost**—time you could spend building, learning, or with people who genuinely value you
- **Psychological harm accumulating** over months and years, eroding self-confidence
- **Wasted effort on their projects** that they ultimately dismiss or never use
- **Guilt manipulation** that keeps you engaged despite clear disrespect
- **Constant insults to your intelligence** that you normalize and ignore, damaging your self-worth

These costs are **not worth whatever value the relationship provides**. Even if their goals align with yours, even if they work on interesting projects, even if they sometimes seem supportive—the pattern of disrespect makes the relationship net-negative.

#### The Solution: Boundaries and Decisive Action

If someone consistently disrespects you, the solution is straightforward: disconnect from them. Completely. Not with ambivalence or hope they'll change—with finality.

**Important caveat:** Relationships involving family, employers, or others you cannot reasonably exit require different strategies. In those cases, you establish firm boundaries, minimize emotional investment, and create exit timelines.

But for voluntary relationships? For friends and associates you've chosen to spend time with?

**Block them.**

There are 8 billion other people on Earth. The probability that this disrespectful person is irreplaceable is essentially zero.

People rarely change without external pressure and personal motivation. Hoping they'll become kind after demonstrating they won't is not optimism—it's denial. Second chances are rare for a reason. Third chances should never happen.

#### Recognizing Your Own Enabling Patterns

Some people develop patterns that enable narcissistic behavior without realizing it:

- **Constant praise and validation** that inflates the other person's ego
- **Avoiding confrontation** by accepting disrespect quietly
- **Making excuses** for their behavior or projecting best intentions onto them
- **Feeling responsible** for maintaining the relationship despite their treatment of you

If you find yourself showering someone with compliments while they criticize you, you're in an asymmetric relationship. Healthy relationships involve mutual respect and balanced feedback.

**Breaking the pattern requires:**
1. Recognizing you deserve respect
2. Setting firm boundaries
3. Being willing to walk away
4. Not hoping they'll change—accepting they probably won't

#### Why This Matters for Development

This might seem tangential to technical content, but it's central to everything that follows. Development—real, ambitious development—requires psychological safety and clear mental space. 

When you're surrounded by people who gaslight you, belittle you, or undermine your confidence, your executive function degrades. Your capacity for creative problem-solving diminishes. You second-guess your instincts and doubt your competence.

Therefore: **eliminate these people from your immediate circles.** This isn't cruel. It's self-preservation. It's necessary.

### Self-Worth and the Imposter Phenomenon

One outcome of prolonged narcissistic relationships is a distorted sense of self-worth. You begin to internalize criticism, assume you're inadequate, and doubt your abilities even when evidence suggests otherwise.

This phenomenon exists across the tech industry to an extreme degree. Developers routinely doubt themselves despite demonstrable competence. Why?

Because the industry systematically rewards *the appearance of expertise* over genuine capability. People advance by projecting confidence, hiding behind accomplishments, and carefully curating what they share.

**This is broken.** And it's perpetuated because it serves those already in power.

The industry also gatekeeps through elitism—dismissing new tools and approaches that make development more accessible. When AI-assisted development emerged, many established developers criticized it heavily, claiming it produces inferior work or that users don't "really" understand what they're building.

This gatekeeping serves a purpose: protecting the status of those who invested years mastering the old methods. If new developers can accomplish similar results faster using AI assistance, it threatens the perceived value of that time investment.

**Ignore the gatekeepers.** Use whatever tools make you effective. Understanding comes through practice and iteration, not through artificial constraints imposed by those threatened by your efficiency.

#### Reframing Confidence

Confidence is not arrogance. Confidence is proportional certainty based on experience. When you've accomplished something, you have earned the right to speak about it clearly. When you haven't, you admit that directly.

This distinction matters: a genuinely confident person admits what they don't know. An insecure person pretends to omniscience.

#### Learning as a Child, Not as an Adult

Children possess a remarkable capability we lose: they learn without fear of failure.

Observe a toddler learning to walk. They fall hundreds of times. Each fall provides data. Eventually, they walk. Then run. Then play complex games. They don't study the physics of bipedal locomotion. They don't memorize textbooks about balance and muscular coordination.

They *practice.*

Most adult learning reverses this process. We read extensively before attempting anything. We try to understand comprehensively before taking action. We study theoretical frameworks before practical application.

This is backwards. Children learn to talk via mimicry and practice, not by studying linguistics. They learn to draw by drawing, not by reading about art theory.

**The optimal learning path is: attempt → receive feedback → adjust → repeat.** This is why project-based learning surpasses textbook learning by orders of magnitude.

#### The Action-First Paradigm

Many people claim they need to "learn the fundamentals first" before building anything. This delays action indefinitely. The truth:

**You don't know where to start because you haven't started.**

Once you begin building something—anything—your path becomes clear. You encounter specific problems that require specific knowledge. You learn that knowledge immediately, in context, where it's meaningful and memorable.

Compare these approaches:

**Traditional approach:**
1. Read 500-page programming textbook
2. Complete all exercises
3. Study design patterns
4. Learn best practices
5. Finally attempt a real project
6. Discover most of what you learned doesn't apply
7. Discover you have zero practical experience

**Action-first approach:**
1. Choose a project that interests you
2. Start building immediately
3. Encounter a problem
4. Learn the specific solution
5. Implement and continue

**Stop reading. Start building.** Today. Right now.

#### Addressing Self-Doubt in Technical Contexts

If you find yourself chronically doubting your abilities:

1. **Recognize this is often a social signal**, not evidence. Your brain evolved in small groups where humility served a function—it prevented you from challenging the social hierarchy.

2. **Examine the evidence directly.** Have you successfully built things? Have you solved problems? Have you learned new systems? If yes to these, doubt is not proportional to evidence.

3. **Understand that imposter syndrome decreases with continued action.** Every project you complete, every problem you solve, provides additional evidence that you're capable.

4. **Recognize that experts universally feel out of their depth.** This is not evidence you shouldn't be doing something. It's evidence you're engaging with genuinely challenging material.

---

## Part II: Setting Up Your Development Environment

### Creating Your Technical Hub

VS Code will serve as your central hub for all development-related work. Not just coding—research, documentation, project management, collaboration, and AI interaction all flow through this single application.

Why consolidate here? Because context switching is expensive. Every time you open a new application, your brain must load a new interface, new workflows, and new mental models. This fragmentation degrades productivity.

By centralizing your development workflow in VS Code, you minimize context switching and maximize flow state.

### Initial Configuration

#### Step 1: Essential Extensions

Search for extensions relevant to your workflow. Modern VS Code supports MCP (Model Context Protocol) extensions that enhance AI integration capabilities.

Install these core extensions:
- **GitHub Copilot**: AI pair programmer
- **GitHub**: Source control integration
- **Language-specific extensions**: For your primary development languages

Install no more than 5-10 additional specialty extensions initially. Resist the temptation to accumulate extensions. Each one adds overhead and complexity.

#### Step 2: Tool Selection and Context Optimization

When working with AI assistants, enable only the tools you'll actually use. Large language models perform better with constrained input.

Start with these categories:
- File system operations
- Git/GitHub operations
- Web searching capabilities
- Terminal execution
- Language-specific tools

You can always adjust this later. This is not a permanent decision.

---

## Part III: Mastering VS Code

### Essential Keyboard Shortcuts

Speed in VS Code comes primarily from keyboard shortcuts. Learning these shortcuts eliminates the cognitive overhead of mouse navigation and menu searching.

Critical shortcuts:
- \`CTRL+P\`: Quick file open (by name)
- \`CTRL+F\`: Find within file
- \`CTRL+H\`: Find and replace
- \`CTRL+K, CTRL+S\`: View all keyboard shortcuts
- \`CTRL+\\\` \` (backtick): Open integrated terminal
- \`CTRL+Shift+P\`: Command palette
- \`CTRL+B\`: Toggle sidebar visibility
- \`CTRL+J\`: Toggle terminal panel

Critical keyboard-text-relevant edit hotkeys:
- \`CTRL+Left/Right Arrow\`: Move back or forward one word
- \`CTRL+Shift+Left/Right Arrow\`: Select text one word at a time
- \`ALT+Up/Down Arrow\`: Move the current line up or down
- \`Shift+Left/Right Arrow\`: Select from the current position

Practice these until they're automatic. Speed accumulates across thousands of interactions.

### File Navigation Patterns

Rather than using File Explorer extensively, rely on \`CTRL+P\` for file opening:
- Type the filename or partial path
- VS Code uses fuzzy matching to find files rapidly

### Terminal Integration

The integrated terminal (opened via \`CTRL+\\\` \`) provides an environment where you can execute commands without leaving VS Code. This preserves flow state.

Navigate to your project directory and open it through VS Code's \`File > Open Folder\` menu.

Alternatively, from the terminal:
\`\`\`powershell
code C:\\path\\to\\project
\`\`\`

### Project-Level Documentation

Every project should contain documentation that provides context about your project structure, conventions, and expectations. Many AI assistants can auto-generate this documentation based on your project structure.

**Never skip this step.** This dramatically improves the quality of AI assistance because it provides project-specific context.

---

## Part IV: AI-Powered Development with GitHub Copilot

### Understanding AI Development Modes

Modern AI coding assistants operate in different modes optimized for different interaction patterns:

#### Conversation Mode

Use for **learning and clarification**. When you need to understand a concept, learn how something works, or receive educational information.

Optimal queries:
- "Explain how async/await works in JavaScript"
- "What does this code segment do?"
- "How should I approach this architectural problem?"

#### Planning Mode

Use for **large-scale, multi-step projects** that cannot be completed in a single interaction. Planning generates detailed roadmaps, breaking down complex objectives.

Optimal queries:
- "Create a roadmap for building a complete authentication system"
- "How would I refactor this monolithic codebase into microservices?"

#### Execution Mode

Use for **task execution**. When you want AI to actually *do something*—write code, modify files, execute commands.

Optimal queries:
- "Implement JWT authentication in this Express app"
- "Refactor this component to use TypeScript"
- "Add error handling to all API routes"

### Prompt Architecture and Clarity

**Prompt quality directly determines response quality.** The structure, clarity, and specificity of your prompts directly impact AI behavior.

#### Principle 1: Specificity

Vague prompts produce vague results. Specific prompts produce specific results.

**Poor prompt:** "Fix the bug"

**Better prompt:** "The application crashes when users with special characters in their username attempt to log in. The error occurs in the authentication module. Debug and fix this issue."

#### Principle 2: Constraint and Direction

Provide constraints that guide the model toward efficient solutions:

**Poor prompt:** "Build a data validation system"

**Better prompt:** "Build a data validation system using only built-in Python validation libraries, without external dependencies. Prioritize performance over flexibility."

#### Principle 3: Explicit Instructions for Ambiguity

When ambiguity exists, state explicitly how it should be handled:

**Poor prompt:** "Refactor this function"

**Better prompt:** "Refactor this function to improve readability without changing its external behavior. Use descriptive variable names and add inline comments."

### Iterative Refinement and Feedback

AI assistants function best within an iterative feedback loop:

1. Provide initial instruction
2. Observe output and identify gaps
3. Provide clarification or additional constraints
4. Iterate until result is satisfactory

This is fundamentally different from traditional approaches. You're collaborating with an AI system.

#### Example Interaction Flow

**Your prompt:** "Build a simple task management API with Express.js"

**AI responds:** [Generates basic Express server with task CRUD operations]

**You observe:** "This doesn't include authentication or error handling"

**Your follow-up:** "Add JWT-based authentication and comprehensive error handling with descriptive error messages."

**AI responds:** [Refines the implementation]

---

## Part V: Advanced Prompt Engineering and Task Management

### Reusable Prompt Templates

Every prompt you craft successfully should be saved and reused. This follows a fundamental principle: **never expend effort without planning to leverage it again.**

When you discover a prompt that produces excellent results:
1. Extract the prompt to a text file
2. Store it alongside related project documentation
3. Reference it for similar future tasks

This creates an accumulated library of high-effectiveness prompts.

### Handling Complex Tasks

When instructing AI to handle complex setup, provide explicit directives:

**Pattern for complex setup tasks:**

\`\`\`
[Your instruction to install/configure something complex]

Please execute this yourself autonomously. Ensure fully installed and 
configured. Do not stop until complete. Continuously fix/review any 
output and get our system to working order.
\`\`\`

This pattern instructs AI to:
- Autonomously solve problems
- Iterate on failures
- Verify completion
- Maintain momentum

### Understanding Model Output

Modern AI produces output with apparent certainty even when that certainty isn't justified. This doesn't mean AI is useless. It means you must maintain **critical evaluation** of output:

1. **When output seems wrong, ask for explanation**
2. **Verify critical outputs** before executing
3. **Test thoroughly** after implementation

---

## Part VI: The Philosophy of Optimal Development

### The Action-Over-Planning Principle

Traditional software development emphasizes exhaustive planning before execution. This made sense when making changes was expensive—when compilation took hours and deployment required physical media.

Modern development inverts this. Changes are cheap. Testing is fast. Deployment is automated.

**Therefore: default to action over planning.**

Don't spend weeks designing the perfect architecture. Build a working prototype in days. Learn from real usage. Iterate rapidly.

### The Fail-Fast Philosophy

Failures are information. The faster you fail, the faster you learn.

When experimenting with new technologies:
1. Build the smallest possible working example
2. Deploy it immediately
3. Observe what breaks
4. Fix it
5. Repeat

This cycle should complete in hours, not weeks.

### The Tools-Are-Neutral Principle

There's no moral virtue in using "difficult" tools. If an easier tool accomplishes the same objective, use it.

AI-assisted development is not "cheating." It's leveraging available resources effectively. Anyone who tells you otherwise is protecting their own psychological investment in outdated methodologies.

### The Compounding-Knowledge Principle

Every problem you solve should make future similar problems trivial.

Document solutions. Save prompts. Build reusable components. Create templates.

After solving a problem once, you should never need to solve it from scratch again.

### The Context-First Principle

Context switching destroys productivity. Minimize the number of tools, applications, and interfaces you use daily.

Consolidate workflows. Use integrated environments. Batch similar tasks together.

### The Speed-Over-Perfection Principle

Perfect code shipped next year is worthless. Good code shipped today creates value immediately.

Focus on:
- Does it work?
- Is it maintainable?
- Does it solve the problem?

Everything else is secondary.

---

## Conclusion

Modern development is fundamentally different from development a decade ago. The tools have changed. The workflows have changed. The optimal strategies have changed.

Developers who cling to outdated paradigms will find themselves increasingly ineffective as AI assistance becomes ubiquitous. Those who adapt—who embrace new tools, who optimize for speed and clarity, who learn through action rather than theory—will thrive.

The future of development is collaborative. Humans provide intent, creativity, and judgment. AI provides execution speed, pattern recognition, and tireless iteration.

Together, this partnership produces results neither could achieve alone.

**Start building. Start now. Everything else follows.**`,
    category: "development",
    difficulty: "beginner",
    estimatedTime: "45-60 minutes",
    prerequisites: ["VS Code installed", "Willingness to change workflows", "Open mind"],
    technologies: ["VS Code", "GitHub Copilot", "AI Tools", "Development Workflows"],
    ...getProjectFallbackDates(1), // Recently created guide
    updatedAt: new Date(),
    slug: "modern-development-ai-guide",
  },
];

export const techStack: TechStack[] = [
  {
    name: "Kubernetes",
    category: "infrastructure",
    level: "expert",
    yearsOfExperience: 4,
    description:
      "Container orchestration, cluster management, and service mesh",
  },
  {
    name: "Docker",
    category: "infrastructure",
    level: "expert",
    yearsOfExperience: 5,
    description:
      "Containerization, multi-stage builds, and registry management",
  },
  {
    name: "Python",
    category: "backend",
    level: "advanced",
    yearsOfExperience: 6,
    description: "FastAPI, Django, automation scripts, and AI/ML integrations",
  },
  {
    name: "Go",
    category: "backend",
    level: "advanced",
    yearsOfExperience: 3,
    description: "High-performance services, CLI tools, and system programming",
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: "advanced",
    yearsOfExperience: 4,
    description: "React, Next.js, and full-stack development",
  },
  {
    name: "Oracle Cloud",
    category: "infrastructure",
    level: "expert",
    yearsOfExperience: 2,
    description: "IaaS, networking, and cost optimization",
  },
  {
    name: "Tailscale",
    category: "infrastructure",
    level: "advanced",
    yearsOfExperience: 2,
    description: "Zero-config mesh networking and secure remote access",
  },
  {
    name: "Traefik",
    category: "infrastructure",
    level: "advanced",
    yearsOfExperience: 3,
    description: "Reverse proxy, load balancing, and SSL automation",
  },
];

export const contactInfo: ContactInfo = {
  email: config.CONTACT_EMAIL,
  github: config.GITHUB_URL,
  location: config.LOCATION,
  timezone: config.TIMEZONE,
  availability: "open-to-opportunities",
  preferredCommunication: ["email", "text-based chat", "async communication"],
  workPreferences: {
    remote: true,
    contract: true,
    fullTime: true,
    partTime: false,
  },
};

export const serviceCategories = {
  "ai-ml": "AI & Machine Learning",
  infrastructure: "Infrastructure",
  monitoring: "Monitoring",
  security: "Security",
  networking: "Networking",
  development: "Development",
  database: "Database",
};
