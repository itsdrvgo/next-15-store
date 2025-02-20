# Next.js 15 Store

A modern e-commerce store built with Next.js 15, showcasing the latest features and best practices in web development.

## 🌟 Overview

This project demonstrates a fully functional e-commerce platform leveraging the power of Next.js 15, tRPC, and a robust PostgreSQL database with DrizzleORM.

## ⚡ Tech Stack

- **Language:** TypeScript
- **Framework:** Next.JS 15, tRPC
- **Styling:** Tailwind CSS, Shadcn/UI, Motion
- **Database:** PostgreSQL with DrizzleORM
- **Deployment:** Vercel

## 🚀 Features

- Dynamic product listings
- Categories and filters
- Search functionality
- Bulk product generation
- Bulk product upload via CSV

## 📦 Installation

1. Clone the repository
    ```bash
    git clone https://github.com/itsdrvgo/next-15-store
    ```
2. Install dependencies
    ```bash
    bun install
    ```
3. Set up environment variables
    ```bash
     cp .env.example .env.local
    ```
4. Set up the database
    ```bash
    bun run db:mig
    ```
5. Start the development server
    ```bash
     bun run dev
    ```

## 🛠️ Development

### Prerequisites

- Basic knowledge of Next.js
- Node.js 20+
- PostgreSQL database (Supabase)
- Bun (Recommended)

### Environment Variables

```
DATABASE_URL=your_database_url
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### Commands

```bash
bun run dev     # Start the development server
bun run build   # Build the project
bun run start   # Start the production server
bun run db:gen  # Generate database schema
bun run db:push # Push database schema
bun run db:mig  # Run database migrations
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🌐 Contact

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/itsdrvgo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/itsdrvgo)
[![Twitch](https://img.shields.io/badge/Twitch-%239146FF.svg?logo=Twitch&logoColor=white)](https://twitch.tv/itsdrvgo)
[![X](https://img.shields.io/badge/X-%23000000.svg?logo=X&logoColor=white)](https://x.com/itsdrvgo)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@itsdrvgodev)
