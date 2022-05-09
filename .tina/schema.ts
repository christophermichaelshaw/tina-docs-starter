// .tina/schema.ts

// ...

const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
const clientId = 'YOUR-CLIENT-ID-HERE'

// When working locally, hit our local filesystem.
// On a Vercel deployment, hit the Tina Cloud API
const apiURL =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:4001/graphql'
    : `https://content.tinajs.io/content/${clientId}/github/${branch}`

export config = defineConfig({
  apiURL
})
