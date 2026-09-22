# Walkthrough: Authentication, Roles, Guards & Module Scaffolding

We implemented complete CRUD operations across the `products`, `orders`, and `users` modules using Prisma 8 ORM, created an `auth` module with JWT authentication and Role-Based Access Control (`ADMIN` and `CUSTOMER`), and strictly preserved the `categories` module without any changes.

---

## 1. Authentication & Authorization (`src/auth`)

Implemented JWT-based authentication and role guard infrastructure:

- **Role Enum**: [role.enum.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/enums/role.enum.ts) defining `CUSTOMER` and `ADMIN` roles matching the Prisma schema.
- **Custom Decorators**:
  - [`@Roles(...roles: Role[])`](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/decorators/roles.decorator.ts): Attaches required roles metadata to routes or controllers.
  - [`@CurrentUser()`](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/decorators/current-user.decorator.ts): Injects the authenticated user payload (`id`, `email`, `role`) directly into controller handler parameters.
  - [`@Public()`](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/decorators/public.decorator.ts): Allows public access when guards are applied.
- **Guards & Strategy**:
  - [`JwtAuthGuard`](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/guards/jwt-auth.guard.ts): Validates JWT tokens using Passport JWT strategy; supports `@Public()`.
  - [`RolesGuard`](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/guards/roles.guard.ts): Enforces role requirements on guarded routes.
  - [`JwtStrategy`](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/auth/strategies/jwt.strategy.ts): Extracts and validates the Bearer token payload.
- **Auth Endpoints**:
  - `POST /auth/register`: Hashes password with `bcryptjs` and creates new user.
  - `POST /auth/login`: Validates credentials and returns JWT `access_token` and user profile.
  - `GET /auth/profile`: Protected endpoint returning authenticated user profile.

---

## 2. Scaffolding Modules (`products`, `orders`, `users`)

### Users Module (`src/users`)
- **[users.service.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/users/users.service.ts)**:
  - `create`: Hashes password, saves user with default `CUSTOMER` or specified role, and strips password from response.
  - `findAll`, `findOne`, `findByEmail`, `update`, `remove`: Fully integrated with Prisma 8 `this.prisma.user`.
- **[users.controller.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/users/users.controller.ts)**:
  - Guarded with `@UseGuards(JwtAuthGuard, RolesGuard)`.
  - `GET /users` and `DELETE /users/:id` restricted to `@Roles(Role.ADMIN)`.
  - `GET /users/:id` and `PATCH /users/:id` allow self-access or admin access, preventing non-admins from self-escalating role.

### Products Module (`src/products`)
- **[products.service.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/products/products.service.ts)**:
  - Validates `categoryId` existence against `this.prisma.category` before creating or updating.
  - Full CRUD using Prisma 8 `this.prisma.product`.
- **[products.controller.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/products/products.controller.ts)**:
  - Public browsing: `GET /products` and `GET /products/:id`.
  - Admin protected: `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` with `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(Role.ADMIN)`.

### Orders Module (`src/orders`)
- **[orders.service.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/orders/orders.service.ts)**:
  - Creates orders bound to the authenticated user ID.
  - `findAll` and `findOne` scope results: Customers only see their own orders; Admins can see all orders.
  - Customers can only cancel their own pending orders; Admins can update any order status (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **[orders.controller.ts](file:///c:/Users/sumer/Desktop/velvet-box-backend/velvet-box-by-sumera/src/orders/orders.controller.ts)**:
  - Protected with `@UseGuards(JwtAuthGuard, RolesGuard)`.
  - Supports role scoping via `@CurrentUser()`.

---

## 3. Categories Module (`src/categories`)

- **Strictly Unaltered**: No files in `src/categories/` were modified.
- All category routes and user implementations remain exactly as originally written.

---

## 4. Verification & Testing

1. **Build Validation**:
   - `npm run build` compiled cleanly with 0 errors.
2. **Lint Validation**:
   - `npm run lint` passed with 0 errors.
3. **Unit Tests**:
   - Ran `npm test` using Vitest across all 7 test suites:
     - `src/app.controller.spec.ts` ✓
     - `src/products/products.service.spec.ts` ✓
     - `src/products/products.controller.spec.ts` ✓
     - `src/orders/orders.service.spec.ts` ✓
     - `src/orders/orders.controller.spec.ts` ✓
     - `src/users/users.service.spec.ts` ✓
     - `src/users/users.controller.spec.ts` ✓
     - **Result: 7/7 test files passed (7 passed tests)**.
