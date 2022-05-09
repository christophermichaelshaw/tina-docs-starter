// .tina/schema.ts

// ...

const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
const clientId = 'c53fb24e-f527-47b3-ba24-c123f6297b67'

// When working locally, hit our local filesystem.
// On a Vercel deployment, hit the Tina Cloud API
const apiURL =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:4001/graphql'
    : `https://content.tinajs.io/content/${clientId}/github/${branch}`

export config = defineConfig({
  apiURL
})
