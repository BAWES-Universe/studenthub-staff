const https = require('https');
const { URL } = require('url');

const GITHUB_API = 'https://api.github.com';

function getToken() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error('Missing GitHub token. Set GITHUB_TOKEN or GH_TOKEN.');
  }
  return token;
}

function request(path, options = {}) {
  const url = new URL(path, GITHUB_API);
  const body = options.body ? JSON.stringify(options.body) : undefined;

  const requestOptions = {
    method: options.method || 'GET',
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'ai-agency-runner',
      'Authorization': `token ${getToken()}`,
      ...options.headers,
    },
  };

  if (body) {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, requestOptions, (res) => {
      let chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const payload = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return resolve(payload ? JSON.parse(payload) : {});
        }
        let errorData;
        try {
          errorData = JSON.parse(payload);
        } catch (err) {
          errorData = { message: payload };
        }
        reject(new Error(`GitHub API ${res.statusCode} ${res.statusMessage}: ${errorData.message || JSON.stringify(errorData)}`));
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getAuthenticatedUser() {
  return request('/user');
}

async function searchIssues(query, per_page = 10) {
  const encoded = encodeURIComponent(query);
  return request(`/search/issues?q=${encoded}&per_page=${per_page}`);
}

async function searchDiscussions(query, per_page = 10) {
  const encoded = encodeURIComponent(`${query} type:discussion state:open`);
  return request(`/search/issues?q=${encoded}&per_page=${per_page}`);
}

async function getRepo(ownerRepo) {
  return request(`/repos/${ownerRepo}`);
}

async function createIssue(ownerRepo, title, body) {
  return request(`/repos/${ownerRepo}/issues`, {
    method: 'POST',
    body: { title, body },
  });
}

async function getReadme(ownerRepo, branch = 'master') {
  return request(`/repos/${ownerRepo}/readme?ref=${branch}`);
}

module.exports = {
  getAuthenticatedUser,
  searchIssues,
  searchDiscussions,
  getRepo,
  createIssue,
  getReadme,
};
