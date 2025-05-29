## Getting Started

First, install the dependencies:

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also run the unit tests using:

```bash
npm run test
```

You can also see the cypress e2e test using:

```bash
npx cypress open
```

\*\* I have not been able to complete the e2e tests for this project

## Architectural Overview

I used Next.js for this project because it is my go-to for simple prototype-level applications. It's easy to set up and most importantly, it's full-stack right out of the box.

I implemented the backend first in src/app/api with respect to the three domains: customer, loan and offer. I chose to design it this way as I think it's much easier to add additional features and endpoints this way. For example: I want to add a resume application functionality, I just need to add a GET customer/:id and a GET loan/:id so that I can pull up any information they have saved previously

However, I decided to leave them as mere controllers so that the bulk of the business logic will reside in the services folder. This way, if I am encountering endpoint-related issues, I know to look first at the controllers and if it's business logic related, I can head to services folder right away. It's also easier for multiple developers to work on their own modules/features in this structure.

Without a way to store data, I just simulated a database in the store/store.ts file, along with pseudo-db operations like find, findOne, insert, etc. I added filtering just like I would add one on Prisma for dynamic queries.

Validation and overall type structure integrity is handled in the lib/schema.ts file. I used zod for validation as it also handles type coercion and integrates very well with typescript.

I am honestly not very fond of frontend stuff, that's why you will notice how unpolished the UI looks, but I managed to put together some modular components along with two separate forms in such a way that I think makes at least a bit of sense. I initially planned to do breadcrumbs but I could never make it work. State management it is.

I slapped together some shadcn style components but I could never make the tailwind work. For the sake of my sanity, I just made it work (for now!)

Finally, I used Jest to make some unit tests for the API calls and Cypress to simulate user activity. I tried to handle as many scenarios as I could but I just didn't have enough time.
