const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3001);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

const defaultData = {
  rooms: [],
  tenants: [],
  invoices: [],
  contracts: [],
  users: [
    { id: 1, name: 'Quản trị viên', email: 'admin@rental.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Quản lý viên', email: 'manager@rental.com', role: 'manager', status: 'active' },
  ],
  updatedAt: null,
};

const allowedKeys = ['rooms', 'tenants', 'invoices', 'contracts', 'users'];

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, `${JSON.stringify(defaultData, null, 2)}\n`, 'utf8');
  }
};

const normalizeData = (data = {}) => ({
  rooms: Array.isArray(data.rooms) ? data.rooms : [],
  tenants: Array.isArray(data.tenants) ? data.tenants : [],
  invoices: Array.isArray(data.invoices) ? data.invoices : [],
  contracts: Array.isArray(data.contracts) ? data.contracts : [],
  users: Array.isArray(data.users) && data.users.length > 0 ? data.users : defaultData.users,
  updatedAt: data.updatedAt || null,
});

const readData = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return normalizeData(JSON.parse(raw));
  } catch (error) {
    return defaultData;
  }
};

const writeData = (data) => {
  const nextData = normalizeData({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(nextData, null, 2)}\n`, 'utf8');
  return nextData;
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
};

const readBody = (request) => new Promise((resolve, reject) => {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', () => {
    if (!body) {
      resolve({});
      return;
    }

    try {
      resolve(JSON.parse(body));
    } catch (error) {
      reject(error);
    }
  });

  request.on('error', reject);
});

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.url === '/health' && request.method === 'GET') {
    sendJson(response, 200, { ok: true, file: DATA_FILE });
    return;
  }

  if (request.url !== '/data') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  try {
    if (request.method === 'GET') {
      sendJson(response, 200, readData());
      return;
    }

    if (request.method === 'PUT') {
      const body = await readBody(request);
      sendJson(response, 200, writeData(body));
      return;
    }

    if (request.method === 'PATCH') {
      const body = await readBody(request);
      const currentData = readData();
      const nextData = { ...currentData };

      allowedKeys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          nextData[key] = body[key];
        }
      });

      sendJson(response, 200, writeData(nextData));
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed' });
  } catch (error) {
    sendJson(response, 400, { error: error.message || 'Bad request' });
  }
});

ensureDataFile();
server.listen(PORT, () => {
  console.log(`File data server running at http://localhost:${PORT}`);
  console.log(`Database file: ${DATA_FILE}`);
});
