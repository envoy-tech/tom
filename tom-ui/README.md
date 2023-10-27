# AdventurUs UI

Welcome to the README for the AdventurUs UI, This project is built off of Next.js, Prisma, Storybook, and TailwindCSS. There are a couple of other things sprinkled around like Formik for form validation, headlessUI for TailwindUI components, and redux toolkit for persistence and state management.

## Getting Started

In order to start using the UI, we would need to install all the npm dependencies which can be done through:

```
yarn
```

Then, we can run the dev server through:

```
npm run dev
```

If we are deploying to production, we would want to build then start:

```
yarn run build
yarn run start
```

## Development

For users to start developing in the UI, we need to make sure some environment variables are set. Start by making a copy of the example.env file as just a `.env` file, then populate those fields with the appropriate values.

### Prisma

To handle prisma for development you need to generate types for the database schema through:

```
npx prisma generate
```
