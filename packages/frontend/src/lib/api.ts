const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('minyflow_token', token);
    } else {
      localStorage.removeItem('minyflow_token');
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return this.token || localStorage.getItem('minyflow_token');
  }

  private isAuthPage(): boolean {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return path === '/login' || path === '/register';
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      if (!this.isAuthPage()) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      const error = await res.json().catch(() => ({ message: 'Credenciais inválidas' }));
      throw new Error(error.message || 'Credenciais inválidas');
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || 'Erro na requisição');
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body?: any) { return this.request<T>('POST', path, body); }
  patch<T>(path: string, body?: any) { return this.request<T>('PATCH', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const api = new ApiClient();
