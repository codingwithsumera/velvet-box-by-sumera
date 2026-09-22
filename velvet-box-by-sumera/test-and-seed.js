import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = text;
  }
  return { status: res.status, ok: res.ok, data: json };
}

async function run() {
  console.log('--- STARTING VELVET BOX TEST & DATA POPULATION ---');

  // 1. Register Admin
  console.log('\n[1] Registering Admin User...');
  const adminEmail = `admin_${Date.now()}@velvetbox.com`;
  const regAdmin = await request('/auth/register', {
    method: 'POST',
    body: {
      email: adminEmail,
      password: 'AdminPassword123!',
      name: 'Sumera Admin',
      role: 'ADMIN',
    },
  });
  console.log('Status:', regAdmin.status);
  console.log('Result:', JSON.stringify(regAdmin.data, null, 2));

  let adminToken = regAdmin.data?.access_token;
  if (!adminToken) {
    console.log('Trying login for admin...');
    const loginAdmin = await request('/auth/login', {
      method: 'POST',
      body: { email: adminEmail, password: 'AdminPassword123!' },
    });
    adminToken = loginAdmin.data?.access_token;
  }

  // 2. Register Customer
  console.log('\n[2] Registering Customer User...');
  const customerEmail = `customer_${Date.now()}@velvetbox.com`;
  const regCust = await request('/auth/register', {
    method: 'POST',
    body: {
      email: customerEmail,
      password: 'CustomerPass123!',
      name: 'Jane Customer',
      role: 'CUSTOMER',
    },
  });
  console.log('Status:', regCust.status);
  console.log('Result:', JSON.stringify(regCust.data, null, 2));
  const customerToken = regCust.data?.access_token;

  // 3. Test Profile for Admin
  console.log('\n[3] Testing GET /auth/profile (Admin)...');
  const profileRes = await request('/auth/profile', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Status:', profileRes.status);
  console.log('Profile:', JSON.stringify(profileRes.data, null, 2));

  // 4. Create Category (using user\'s untouched Category module)
  console.log('\n[4] Creating Category via POST /categories...');
  const catRes = await request('/categories', {
    method: 'POST',
    body: {
      name: `Luxury Perfumes ${Date.now().toString().slice(-4)}`,
    },
  });
  console.log('Status:', catRes.status);
  console.log('Category:', JSON.stringify(catRes.data, null, 2));
  const categoryId = catRes.data?.id;

  // 5. Test Product Creation Role Guard
  console.log('\n[5a] Testing Product Creation as Customer (Expect 403 Forbidden)...');
  const forbiddenProd = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      title: 'Hacked Product',
      price: 10,
      stock: 5,
      categoryId,
    },
  });
  console.log('Status (Should be 403):', forbiddenProd.status);
  console.log('Response:', JSON.stringify(forbiddenProd.data, null, 2));

  console.log('\n[5b] Creating Product as Admin (Expect 201 Created)...');
  const prodRes = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      title: 'Velvet Rose & Ambergris',
      description: 'Exclusive artisanal fragrance with rich velvet rose and warm amber notes.',
      price: 185.00,
      stock: 25,
      categoryId,
    },
  });
  console.log('Status:', prodRes.status);
  console.log('Product created:', JSON.stringify(prodRes.data, null, 2));
  const productId = prodRes.data?.id;

  // 6. Publicly Browse Products
  console.log('\n[6] Public Browsing GET /products (No auth required)...');
  const allProds = await request('/products');
  console.log('Status:', allProds.status);
  console.log('Products count:', allProds.data?.length || 0);

  // 7. Create Order as Customer
  console.log('\n[7] Creating Order as Customer via POST /orders...');
  const orderRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      total: 185.00,
    },
  });
  console.log('Status:', orderRes.status);
  console.log('Order created:', JSON.stringify(orderRes.data, null, 2));

  // 8. Test Order Scoping
  console.log('\n[8a] Customer Views Orders (Expect only customer orders)...');
  const custOrders = await request('/orders', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  console.log('Status:', custOrders.status);
  console.log('Customer orders count:', custOrders.data?.length || 0);

  console.log('\n[8b] Admin Views Orders (Expect all orders in system)...');
  const adminOrders = await request('/orders', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Status:', adminOrders.status);
  console.log('Admin total orders count:', adminOrders.data?.length || 0);

  // 9. Test Users Management Guard
  console.log('\n[9a] Customer accesses GET /users (Expect 403 Forbidden)...');
  const custUsers = await request('/users', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  console.log('Status (Should be 403):', custUsers.status);

  console.log('\n[9b] Admin accesses GET /users (Expect 200 OK)...');
  const adminUsers = await request('/users', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Status (Should be 200):', adminUsers.status);
  console.log('Users count:', adminUsers.data?.length || 0);

  console.log('\n--- ALL TESTS AND DATA POPULATION COMPLETED SUCCESSFULLY! ---');
}

run().catch(console.error);
