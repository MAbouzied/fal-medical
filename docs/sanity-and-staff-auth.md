# Sanity content and staff authentication

Operational guide for the Fal Clinic blog Content Lake and `/admin` staff area.

## Public blog content

| Value | Setting |
| --- | --- |
| Project ID | `nzy22u9z` |
| Dataset | `production` |
| API version | `2026-08-03` |
| Provider switch | `BLOG_PROVIDER=sanity` |

Published blog reads use the public dataset without `SANITY_API_TOKEN`. If it becomes private, create a Viewer-only token and keep it server-only. Never reuse the staff authorization token for public blog content.

## Private staff access directory

The approved-email source is a separate private Sanity dataset. It is independent from the public `production` dataset and is checked on every `/admin/**` and `/api/admin/**` request.

| Variable | Placement | Purpose |
| --- | --- | --- |
| `SANITY_PROJECT_ID` | Server build/runtime env | Existing Sanity project ID |
| `SANITY_API_VERSION` | Server build/runtime env | Existing pinned API version |
| `SANITY_AUTH_DATASET=staff-auth` | Runtime Worker secret | Private dataset containing `staffAccess` documents |
| `SANITY_AUTH_TOKEN` | Runtime Worker secret | Token scoped to the private dataset with read/write access |
| `BETTER_AUTH_SECRET` | Runtime Worker secret | Encrypts and signs stateless sessions |
| `BETTER_AUTH_URL` | Runtime Worker secret | `http://localhost:4321` locally or the production origin |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Runtime Worker secrets | Google OAuth client credentials |

`SANITY_AUTH_TOKEN` must not be prefixed with `PUBLIC_`, committed, added to the public production dataset, or reused as a browser token. The app uses an authenticated Sanity client with `useCdn: false`, so a removed record stops access on the next protected request.

Each `staffAccess` record contains a required normalized email. `name` and `image` are optional, read-only Google-profile fields synchronized best-effort after that person signs in. Editing an email clears those profile fields. The management API accepts only an email; it never accepts profile fields from the browser.

### First administrator and rollout order

1. Create the `staff-auth` dataset as a **private** dataset in the same Sanity project.
2. Create a server-only token limited to that private dataset and configure `SANITY_AUTH_DATASET` and `SANITY_AUTH_TOKEN` in the Worker runtime.
3. Deploy the two-workspace Studio, then open its `/staff-auth` workspace.
4. Manually create and publish the first `staffAccess` document using that administrator's trimmed, lowercase Google email. Do not import or seed a dummy email from environment files.
5. Configure the Better Auth and Google OAuth runtime secrets, including the redirect URLs below.
6. Deploy the application, verify that the first administrator can sign in, then use `/admin/users` to grant access to additional staff.
7. Remove `ADMIN_AUTH_DISABLED` from every deployed environment. It is only a local development bypass.

If the private directory cannot be read, access fails closed with a service-unavailable response. A rejected Google profile instead produces: “You don’t have permission to access the admin dashboard.”

## Studio workspaces

The standalone Studio lives in [`studio/`](../studio/):

```sh
cd studio
npm install
npm run dev
```

It exposes two isolated workspaces:

| Workspace path | Dataset | Schemas |
| --- | --- | --- |
| `/content` | `production` | Existing blog schemas only |
| `/staff-auth` | `staff-auth` | `staffAccess` only |

Deploy with `npm run deploy`. Studio membership remains separate from Better Auth: anyone opening the Studio must also have the appropriate Sanity project membership. A browser never receives the shared staff authorization token.

## Google OAuth and sessions

Configure these Google OAuth redirect URIs:

- `http://localhost:4321/api/auth/callback/google`
- `https://falclinic.com/api/auth/callback/google`

Configure these authorized origins:

- `http://localhost:4321`
- `https://falclinic.com`

Google sign-in requests only `openid`, `email`, and `profile`. A session is established only when Google reports a verified email and the normalized email has a published `staffAccess` record. Sessions use stateless encrypted cookies for roughly eight hours, while protected requests always revalidate the private directory. Auth and admin responses are private, uncacheable, and excluded from indexing.

For local UI testing, set `ADMIN_AUTH_DISABLED=true` in `.dev.vars`. This skips the app's auth gate only; it does not create a staff record or make the private Sanity store optional.

## Image CDN

Sanity images use `https://cdn.sanity.io`. Optional Google profile images use Googleusercontent hosts. Keep both allowed in the site image Content Security Policy.
