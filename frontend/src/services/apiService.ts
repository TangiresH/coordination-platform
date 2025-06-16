
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;
    
    try {
      return await this.request('/auth/me');
    } catch {
      return JSON.parse(stored);
    }
  }

  // Users methods
  async getUsers() {
    return this.request('/users');
  }

  // Requests methods
  async getRequests() {
    return this.request('/requests');
  }

  async createRequest(requestData: any) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateRequest(id: number, updates: any) {
    return this.request(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRequest(id: number) {
    return this.request(`/requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Offers methods
  async getOffers() {
    return this.request('/offers');
  }

  async createOffer(offerData: any) {
    return this.request('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async updateOffer(id: number, updates: any) {
    return this.request(`/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteOffer(id: number) {
    return this.request(`/offers/${id}`, {
      method: 'DELETE',
    });
  }

  // Help offers methods
  async getHelpOffers() {
    return this.request('/help-offers');
  }

  async createHelpOffer(helpOfferData: any) {
    return this.request('/help-offers', {
      method: 'POST',
      body: JSON.stringify(helpOfferData),
    });
  }

  async updateHelpOffer(id: number, updates: any) {
    return this.request(`/help-offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Help requests methods
  async getHelpRequests() {
    return this.request('/help-requests');
  }

  async createHelpRequest(helpRequestData: any) {
    return this.request('/help-requests', {
      method: 'POST',
      body: JSON.stringify(helpRequestData),
    });
  }

  async updateHelpRequest(id: number, updates: any) {
    return this.request(`/help-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Image upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
    
    return await response.json();
  }
}

export const apiService = new ApiService();
