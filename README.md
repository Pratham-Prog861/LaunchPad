# LaunchPad 🚀

**LaunchPad** is a modern, interactive, drag-and-drop landing page studio and builder. Built on the latest web technologies, it allows creators and developers to visually build, edit, preview, and publish customized landing pages in minutes.

---

## 🎨 Key Features

- **Drag-and-Drop Workspace**: Powered by `@dnd-kit`, allowing users to easily reorder and arrange modular landing page sections (Hero, Features, Testimonial, and CTA).
- **Real-Time Property Editor**: Side panel to edit content, text alignment, CTA link options, and design configurations.
- **Redux-Backed Architecture**: Uses Redux Toolkit to synchronize workspace layout edits, UI modes, and publication status.
- **Role-Based Access Control (RBAC)**: Integrated with **Clerk Authentication** and an RBAC Simulator demonstrating access controls for admin/member roles.
- **Interactive Schema Playground**: Learn how workspace sections map to structured JSON schemas.
- **Clerk Organization Management**: Dedicated dashboard panel rendering Clerk's `<OrganizationProfile />` to manage membership invitations and user roles.
- **Dynamic Notifications**: A real-time notification dropdown in the TopBar to keep track of page creations, updates, and production deployments.
- **End-to-End Testing**: High-confidence testing configuration using **Playwright** and accessibility audits with `@axe-core/playwright`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Authentication**: [Clerk Auth](https://clerk.com/)
- **Workspace Drag-and-Drop**: [@dnd-kit](https://dnd-kit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Playwright](https://playwright.dev/) & [Axe Core](https://github.com/dequelabs/axe-core)
- **CI/CD**: GitHub Actions

---

## 📂 Project Structure

```text
launchpad/
├── .github/workflows/   # CI/CD Workflows
├── src/
│   ├── app/             # Next.js App Router (Studio, Preview, Auth, Organization, APIs, etc.)
│   ├── components/      # UI, Layout, Landing Page Sections, Studio Editor & Renderer
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Redux Store, Auth adapters, Zod Schemas, and Utilities
│   └── proxy.ts         # Proxy config utilities
├── tests/               # Playwright E2E and accessibility tests
├── playwright.config.ts # Playwright settings
└── package.json         # Dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have [Node.js v22+](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

### 2. Environment Variables

Create a `.env.local` file in the root directory and configure the Clerk API keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Installation

Install dependencies using `pnpm`:

```bash
pnpm install
```

### 4. Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the landing page and enter the Studio.

---

## 🧪 Available Scripts

Inside the project directory, you can run the following scripts:

- **`pnpm dev`**: Runs the app in development mode.
- **`pnpm build`**: Builds the production bundle.
- **`pnpm start`**: Starts the production server after building.
- **`pnpm lint`**: Lints the project code with ESLint.
- **`pnpm exec playwright test`**: Runs the Playwright E2E tests.

---

## 🤖 CI/CD Integration

The workflow in [.github/workflows/ci.yml](file:///.github/workflows/ci.yml) is configured to run code verification (linting, type-checking, building, and running E2E tests).

> [!NOTE]
> This workflow is configured with `workflow_dispatch`, meaning it **must be manually triggered** from the Actions tab of your GitHub repository.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///LICENSE) file for details.
