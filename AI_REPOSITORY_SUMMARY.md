# AI Repository Summary

## 1. Purpose

This repository contains a full-stack SvelteKit application for Commonwealth School Project Week.

Primary product goals:
- Let students create and manage project records.
- Let advisors manage advisees and review submissions.
- Let admins manage identity, projects, mentors, and year status.
- Let authenticated users browse published project content.
- Support mobile-friendly image upload through temporary upload keys.

## 2. Tech Stack

Core stack:
- Framework: SvelteKit 2, Svelte 5
- Language: TypeScript
- Build: Vite
- Database: MongoDB via Mongoose
- Object storage: AWS S3 via AWS SDK v3
- Auth provider: Google OAuth
- Image processing: Sharp
- Styling/UI: Tailwind CSS, Flowbite Svelte, Carbon icons

Notable scripts from package.json:
- dev: vite dev
- build: vite build
- check: svelte-kit sync && svelte-check --tsconfig ./tsconfig.json
- check:watch: pnpm run check -- --watch
- lint: prettier check + eslint
- format: prettier write
- prod: npm install && vite build && node -r dotenv/config build

## 3. Runtime Architecture

High-level architecture:
- UI and route handlers live under src/routes.
- Request-time auth/session and role guards are centralized in src/hooks.server.ts.
- Data access is via MongoDB models in src/server/mongo/schemas.
- External service adapters are in src/server/aws.ts and src/server/google.ts.

Authentication and authorization:
- Session token is stored in cookie key session_id.
- src/hooks.server.ts loads user by session_id and populates event.locals.user.
- Route-group-based authorization is enforced by checking route id segments:
- (authenticated): must be logged in
- (students): accountType must be Student
- (advisors): accountType must be Advisor
- (admins): accessLevel must be Admin

Important implication:
- Access control depends on route naming conventions and placement in grouped folders.

## 4. Route Map

Top-level route groups:
- src/routes/(joint): main web app shell and most user-facing pages
- src/routes/(joint)/(authenticated): protected pages for logged-in users
- src/routes/(joint)/(authenticated)/(students): student-only features
- src/routes/(joint)/(authenticated)/(advisors): advisor-only features
- src/routes/(joint)/(authenticated)/(admins): admin-only features
- src/routes/mobile-upload-portal: tokenized upload flow for mobile
- src/routes/poster: server endpoint related to poster/session behavior

Representative feature areas:
- Login callback: src/routes/(joint)/login/redirect/+server.ts
- Project browsing: src/routes/(joint)/(authenticated)/projects
- Images browsing: src/routes/(joint)/(authenticated)/images (supports mode=recent|random)
- Student project CRUD: src/routes/(joint)/(authenticated)/(students)/manage-projects
- Student image management: src/routes/(joint)/(authenticated)/(students)/manage-images
- Advisor advisee workflow: src/routes/(joint)/(authenticated)/(advisors)/manage-advisees
- Admin operations: src/routes/(joint)/(authenticated)/(admins)/admin

## 5. Data Model Overview

Schemas are in src/server/mongo/schemas.

Users (user.ts):
- Identity and profile (name, email, picture, googleId)
- Session state (sessionId, lastVisit)
- Access control (accountType, accessLevel)
- Advisor linkage (adviseeIds)

Projects (project.ts):
- studentId, title, year, tags, mentorId
- shortDesc, fullReport
- underReview, publish

Images (image.ts):
- type, size, description
- s3Bucket, s3ObjectKey
- ownerId, projectId

Mentors (mentor.ts):
- name, organization, email, phoneNumber
- mergedInformation
- text index on name and organization

Mobile upload keys (mobileKey.ts):
- projectId, userId, mobileKey
- expireAt with MongoDB TTL (3h)

## 6. Integrations

MongoDB:
- Connection helper in src/server/mongo/index.ts.
- Uses a cached/global pattern to avoid reconnect overhead.

Google OAuth:
- src/server/google.ts exchanges auth code for tokens.
- Fetches user profile from Google userinfo endpoint.

AWS S3:
- src/server/aws.ts wraps put/get/delete object operations.
- Uses AWS_S3_IMAGES_SUBFOLDER prefixing logic for object keys.

## 7. Upload Flow (Important)

Primary mobile upload path:
- Endpoint: src/routes/mobile-upload-portal/+server.ts
- Accepts multipart form data with mobileKey and image.
- Validates key against MobileKey schema.
- Validates MIME type and user storage quota.
- Optionally compresses JPEG/PNG using Sharp when compressed bytes are smaller.
- Uploads object to S3.
- Persists image metadata to Image schema.

Images page modes:
- Endpoint/load: src/routes/(joint)/(authenticated)/images/+page.server.ts
- mode=recent: paginated, newest first, bounded page/items inputs
- mode=random: single page, no pagination UI, 24 images, one random image per project when possible
- Non-admin users only see images from published projects

Direct image serving guard:
- Endpoint: src/routes/(joint)/(authenticated)/images/[imageId=dbid]/+server.ts
- Image fetch now checks project visibility/ownership/advisor/admin privileges before returning binary
- Uses public cache for published/admin-visible responses, private cache for non-public visibility cases

Operational caveat:
- Upload endpoint is key-based rather than user-session-based, so key lifecycle and secrecy are security-critical.

## 8. Environment Variables

Variables observed in code:
- MONGO_URI
- GOOGLE_CLIENT_SECRET
- PUBLIC_GOOGLE_CLIENT_ID
- PUBLIC_ORIGIN
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_IMAGES_BUCKET
- AWS_S3_IMAGES_SUBFOLDER
- USER_IMAGE_SPACE_LIMIT
- USER_IMAGE_DESCRIPTION_LIMIT
- PORT (via Vite runtime config)

## 9. Common Task Entry Points

If asked to change authentication behavior:
- Start at src/hooks.server.ts
- Then inspect login callback handler and account typing in enums/types

If asked to add/modify API behavior:
- Start in relevant +server.ts under src/routes/(joint)/(authenticated)
- Then update related schema and validation logic

If asked to change project fields:
- Update src/server/mongo/schemas/project.ts
- Update related server routes in manage-projects and projects views
- Update shared interfaces in src/interfaces and client forms

If asked to change image upload behavior:
- Update src/routes/mobile-upload-portal/+server.ts
- Update src/routes/(joint)/(authenticated)/(students)/manage-images/*
- Validate S3 helper behavior in src/server/aws.ts

If asked to change image browsing behavior:
- Start in src/routes/(joint)/(authenticated)/images/+page.server.ts (mode logic and visibility filtering)
- Then update src/routes/(joint)/(authenticated)/images/+page.svelte (mode controls and conditional pagination)
- Re-check direct access policy in src/routes/(joint)/(authenticated)/images/[imageId=dbid]/+server.ts

## 10. Agent Guardrails

When editing this repository:
- Preserve route-group semantics because access control depends on folder grouping.
- Preserve session_id cookie contract unless intentionally migrating auth.
- Keep Mongo schema changes synchronized with UI forms and server handlers.
- Validate serialization expectations when returning DB objects to client-facing loads/endpoints.
- Treat mobile upload key flows as sensitive paths.
- Keep image visibility rules consistent between image list loads and direct image binary endpoint.

## 11. Fast Read Order For New Agents

Recommended first-pass files:
1. src/hooks.server.ts
2. src/routes/(joint)/login/redirect/+server.ts
3. src/server/mongo/index.ts
4. src/server/mongo/schemas/user.ts
5. src/server/mongo/schemas/project.ts
6. src/routes/(joint)/(authenticated)/(students)/manage-projects/+server.ts
7. src/routes/mobile-upload-portal/+server.ts
8. src/server/aws.ts
9. src/server/google.ts
10. package.json

## 12. Maintenance Policy

Update this file whenever any of the following change:
- Route-group structure or authorization checks
- Auth/session flow
- Mongo schemas
- Upload pipeline
- Build/deploy scripts or required environment variables
