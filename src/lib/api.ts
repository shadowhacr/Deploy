const API_BASE = '';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  auth: {
    checkUsername: (username: string) =>
      fetchAPI('/api/auth/username', {
        method: 'POST',
        body: JSON.stringify({ username }),
      }),
    getUser: (username: string) =>
      fetchAPI(`/api/auth/user/${username}`),
  },
  templates: {
    list: (params?: { page?: number; limit?: number; category?: string; search?: string; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.sort) query.set('sort', params.sort);
      return fetchAPI(`/api/templates?${query}`);
    },
    get: (id: string) => fetchAPI(`/api/templates/${id}`),
    categories: () => fetchAPI('/api/templates/categories'),
  },
  deploy: {
    deploy: (username: string, templateId: string, customizations: Record<string, string>) =>
      fetchAPI('/api/deploy', {
        method: 'POST',
        body: JSON.stringify({ username, templateId, customizations }),
      }),
    getDeployments: (username: string) =>
      fetchAPI(`/api/deploy/deployments/${username}`),
  },
  credits: {
    packages: () => fetchAPI('/api/credits/packages'),
    purchase: (username: string, packageId: string) =>
      fetchAPI('/api/credits/purchase', {
        method: 'POST',
        body: JSON.stringify({ username, package: packageId }),
      }),
  },
  settings: {
    get: () => fetchAPI('/api/settings'),
  },
  admin: {
    login: (password: string) =>
      fetchAPI('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      }),
    getStats: (token: string) =>
      fetchAPI('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    getUsers: (token: string) =>
      fetchAPI('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    updateCredits: (token: string, username: string, credits: number, action: 'add' | 'remove') =>
      fetchAPI('/api/admin/credits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, credits, action }),
      }),
    getTemplates: (token: string) =>
      fetchAPI('/api/admin/templates', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    deleteTemplate: (token: string, id: string) =>
      fetchAPI(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),
    getSettings: (token: string) =>
      fetchAPI('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    updateSettings: (token: string, settings: any) =>
      fetchAPI('/api/settings', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      }),
    changePassword: (token: string, currentPassword: string, newPassword: string) =>
      fetchAPI('/api/settings/password', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },
};
