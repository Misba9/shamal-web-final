# API Reference

Base URL: `http://localhost:3002/api` (or your `API_BASE`)

**Auth:** Admin routes require `Authorization: Bearer <JWT>`.

---

## Projects

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /projects | Admin | Create project |
| GET | /projects | Public | List projects. Public: only `status=active`. Admin: full filter (`?status=`, `?archived=`, `?page=`, `?limit=`) |
| GET | /projects/:id | Public | Get one. Public: only if active. Admin: any |
| PUT | /projects/:id | Admin | Update project |
| DELETE | /projects/:id | Admin | Delete project (hard delete) |

**Example (public):**
```js
const res = await fetch(`${API_BASE}/projects?limit=20`);
const { data } = await res.json();
```

---

## Blogs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /blogs | Admin | Create blog |
| GET | /blogs | Public | List. Public: only `status=published`. Admin: full filter |
| GET | /blogs/check-slug?slug= | Public | Check slug availability |
| GET | /blogs/:slugOrId | Public | Get by slug (published) or by id (admin sees draft) |
| PUT | /blogs/:id | Admin | Update blog |
| DELETE | /blogs/:id | Admin | Delete blog |

**Example (public – single by slug):**
```js
const res = await fetch(`${API_BASE}/blogs/my-post-slug`);
const { data } = await res.json();
```

---

## Contacts (Contact Form)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /contacts | Public | Submit contact (body: `name`, `email`, `message`, `phone?`) |
| GET | /contacts | Admin | List contacts (backed by Lead), sort by date |
| GET | /contacts/export | Admin | Export CSV |
| GET | /contacts/:id | Admin | Get one |
| PATCH | /contacts/:id | Admin | Update (e.g. `read`, `status`, `internalNotes`, `emailNotify`) |
| DELETE | /contacts/:id | Admin | Delete |

**Example (public – submit form):**
```js
await fetch(`${API_BASE}/contacts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane', email: 'j@x.com', phone: '+966...', message: 'Hello' }),
});
```

---

## Newsletter

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /newsletter | Public | Subscribe (body: `email`) |
| GET | /newsletter | Admin | List subscribers |
| GET | /newsletter/export | Admin | Export CSV |
| DELETE | /newsletter/:id | Admin | Remove subscriber |

**Example (public – subscribe):**
```js
await fetch(`${API_BASE}/newsletter`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
});
```

---

## Auth (Admin)

- `POST /api/auth/admin/login` — body: `{ email, password }` → `{ token, admin }`

Admin JWT must be sent as `Authorization: Bearer <token>` on protected routes.
