## Blog system build plan

### 1. Database (one migration)
- `blog_posts` (all fields per spec)
- `blog_subscribers` (email unique, first_name, source)
- `blog_categories` (seeded with 6 categories)
- RLS:
  - `blog_posts`: public SELECT where `published=true`; admin (has_role 'admin') full access
  - `blog_categories`: public SELECT; admin write
  - `blog_subscribers`: public INSERT only; admin SELECT
- Trigger `update_updated_at_column` on blog_posts
- Seed 6 categories + 1 post (the-over-investor)

### 2. Server functions (`src/lib/blog.functions.ts`)
- `listPublishedPosts({ category? })` — public, uses `supabaseAdmin` with WHERE published=true
- `getPostBySlug(slug)` — public
- `listCategories()` — public
- `subscribeToBlog({ email, first_name })` — public, insert with onConflict ignore
- `listAllPostsAdmin()` — `requireSupabaseAuth` + admin role check
- `upsertPost(...)` — admin
- `togglePublish(id)` — admin
- `deletePost(id)` — admin

### 3. Public routes
- `src/routes/blog.index.tsx` — REWRITE: video bg, hero, subscribe form, category pills, post grid (loader fetches posts + categories)
- `src/routes/blog.$slug.tsx` — NEW: full post page with JSON-LD, TipTap HTML render, related posts, subscribe at bottom. Replaces hardcoded `blog.the-over-investor.tsx` (delete it).
- `src/routes/blog.category.$category.tsx` — NEW: filtered grid

### 4. Admin routes (under `_authenticated`)
- `src/routes/_authenticated/admin.blog.index.tsx` — table of posts with filter tabs, publish toggle
- `src/routes/_authenticated/admin.blog.new.tsx`
- `src/routes/_authenticated/admin.blog.edit.$id.tsx`
- Both editor routes share `<PostEditor>` component

### 5. Components
- `src/components/blog/SubscribeForm.tsx` — first name + email + button + success state
- `src/components/blog/PostCard.tsx` — card used in index/category/related
- `src/components/blog/CategoryPills.tsx`
- `src/components/blog/VideoBackground.tsx` — reusable parchment-overlay video bg
- `src/components/blog/PostEditor.tsx` — TipTap editor + settings panel + auto-save + SEO preview
- `src/components/blog/TipTapToolbar.tsx`
- `src/components/blog/prose.css` (or inline styles) — prose styling per spec

### 6. Dependencies
`bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-youtube @tiptap/extension-link @tiptap/extension-placeholder dompurify @types/dompurify`

### 7. Sitemap
Update `src/routes/sitemap[.]xml.ts` to query published posts + categories dynamically.

### 8. Admin role
Currently no admin user exists. After migration, ask the user to share the email of the account that should be admin so I can grant `admin` role via `user_roles`. For now editor will check `has_role(uid,'admin')` and unauthorized users see a "request access" message.

### Notes
- Reuse existing `SiteNav` / `SiteFooter` on public blog pages.
- Sanitize rendered HTML with DOMPurify before `dangerouslySetInnerHTML`.
- Replace the existing `blog.the-over-investor.tsx` static route with the dynamic `blog.$slug.tsx` (seed post serves the same URL).
- All copy free of em-dashes.

Approve and I'll build it in one pass.