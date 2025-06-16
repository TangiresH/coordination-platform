
import { apiService } from './apiService';

// Режим роботи: 'local' для localStorage, 'api' для бекенду
const MODE = process.env.REACT_APP_DATA_MODE || 'local';

export class DataService {
  private static isApiMode() {
    return MODE === 'api';
  }

  // Users
  static async getUsers() {
    if (this.isApiMode()) {
      return await apiService.getUsers();
    }
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  static async saveUsers(users: any[]) {
    if (this.isApiMode()) {
      // API режим не потребує прямого збереження масиву користувачів
      return;
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  static async registerUser(userData: any) {
    if (this.isApiMode()) {
      return await apiService.register(userData);
    }
    
    const users = await this.getUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      verified: false
    };
    users.push(newUser);
    await this.saveUsers(users);
    return newUser;
  }

  // Authentication
  static async login(email: string, password: string) {
    if (this.isApiMode()) {
      return await apiService.login(email, password);
    }
    
    const users = await this.getUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      this.setCurrentUser(user);
    }
    return user;
  }

  static async logout() {
    if (this.isApiMode()) {
      return await apiService.logout();
    }
    localStorage.removeItem('currentUser');
  }

  static getCurrentUser() {
    if (this.isApiMode()) {
      return apiService.getCurrentUser();
    }
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  static setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Requests
  static async getRequests() {
    if (this.isApiMode()) {
      return await apiService.getRequests();
    }
    return JSON.parse(localStorage.getItem('requests') || '[]');
  }

  static async saveRequests(requests: any[]) {
    if (this.isApiMode()) {
      return;
    }
    localStorage.setItem('requests', JSON.stringify(requests));
  }

  static async createRequest(requestData: any) {
    if (this.isApiMode()) {
      return await apiService.createRequest(requestData);
    }
    
    const requests = await this.getRequests();
    const newRequest = {
      id: Date.now(),
      ...requestData,
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    await this.saveRequests(requests);
    return newRequest;
  }

  static async updateRequest(id: number, updates: any) {
    if (this.isApiMode()) {
      return await apiService.updateRequest(id, updates);
    }
    
    const requests = await this.getRequests();
    const updatedRequests = requests.map((req: any) => 
      req.id === id ? { ...req, ...updates } : req
    );
    await this.saveRequests(updatedRequests);
    return updatedRequests.find((req: any) => req.id === id);
  }

  // Offers
  static async getOffers() {
    if (this.isApiMode()) {
      return await apiService.getOffers();
    }
    return JSON.parse(localStorage.getItem('offers') || '[]');
  }

  static async saveOffers(offers: any[]) {
    if (this.isApiMode()) {
      return;
    }
    localStorage.setItem('offers', JSON.stringify(offers));
  }

  static async createOffer(offerData: any) {
    if (this.isApiMode()) {
      return await apiService.createOffer(offerData);
    }
    
    const offers = await this.getOffers();
    const newOffer = {
      id: Date.now(),
      ...offerData,
      createdAt: new Date().toISOString()
    };
    offers.push(newOffer);
    await this.saveOffers(offers);
    return newOffer;
  }

  static async updateOffer(id: number, updates: any) {
    if (this.isApiMode()) {
      return await apiService.updateOffer(id, updates);
    }
    
    const offers = await this.getOffers();
    const updatedOffers = offers.map((offer: any) => 
      offer.id === id ? { ...offer, ...updates } : offer
    );
    await this.saveOffers(updatedOffers);
    return updatedOffers.find((offer: any) => offer.id === id);
  }

  // Help Offers
  static async getHelpOffers() {
    if (this.isApiMode()) {
      return await apiService.getHelpOffers();
    }
    return JSON.parse(localStorage.getItem('helpOffers') || '[]');
  }

  static async saveHelpOffers(helpOffers: any[]) {
    if (this.isApiMode()) {
      return;
    }
    localStorage.setItem('helpOffers', JSON.stringify(helpOffers));
  }

  static async addHelpOffer(helpOffer: any) {
    if (this.isApiMode()) {
      return await apiService.createHelpOffer(helpOffer);
    }
    
    const helpOffers = await this.getHelpOffers();
    const newHelpOffer = {
      id: Date.now(),
      ...helpOffer,
      createdAt: new Date().toISOString()
    };
    helpOffers.push(newHelpOffer);
    await this.saveHelpOffers(helpOffers);
    return newHelpOffer;
  }

  static async updateHelpOffer(id: number, updates: any) {
    if (this.isApiMode()) {
      return await apiService.updateHelpOffer(id, updates);
    }
    
    const helpOffers = await this.getHelpOffers();
    const updatedHelpOffers = helpOffers.map((offer: any) => 
      offer.id === id ? { ...offer, ...updates } : offer
    );
    await this.saveHelpOffers(updatedHelpOffers);
    return updatedHelpOffers.find((offer: any) => offer.id === id);
  }

  // Help Requests
  static async getHelpRequests() {
    if (this.isApiMode()) {
      return await apiService.getHelpRequests();
    }
    return JSON.parse(localStorage.getItem('helpRequests') || '[]');
  }

  static async saveHelpRequests(helpRequests: any[]) {
    if (this.isApiMode()) {
      return;
    }
    localStorage.setItem('helpRequests', JSON.stringify(helpRequests));
  }

  static async addHelpRequest(helpRequest: any) {
    if (this.isApiMode()) {
      return await apiService.createHelpRequest(helpRequest);
    }
    
    const helpRequests = await this.getHelpRequests();
    const newHelpRequest = {
      id: Date.now(),
      ...helpRequest,
      createdAt: new Date().toISOString()
    };
    helpRequests.push(newHelpRequest);
    await this.saveHelpRequests(helpRequests);
    return newHelpRequest;
  }

  static async updateHelpRequest(id: number, updates: any) {
    if (this.isApiMode()) {
      return await apiService.updateHelpRequest(id, updates);
    }
    
    const helpRequests = await this.getHelpRequests();
    const updatedHelpRequests = helpRequests.map((request: any) => 
      request.id === id ? { ...request, ...updates } : request
    );
    await this.saveHelpRequests(updatedHelpRequests);
    return updatedHelpRequests.find((request: any) => request.id === id);
  }

  // Image upload
  static async uploadImage(file: File) {
    if (this.isApiMode()) {
      return await apiService.uploadImage(file);
    }
    
    // Локальний режим - конвертуємо в base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({ url: event.target?.result });
      };
      reader.readAsDataURL(file);
    });
  }

  // Ініціалізація тестових даних (тільки для локального режиму)
  static async initializeData() {
    if (this.isApiMode()) {
      return;
    }
    
    const users = await this.getUsers();
    if (users.length === 0) {
      const defaultUsers = [
        { id: 1, email: 'military@army.ua', password: '123456', type: 'military', name: '72-га механізована бригада', verified: true },
        { id: 2, email: 'volunteer@help.org', password: '123456', type: 'charity', name: 'Благодійний фонд "Допомога"', verified: true }
      ];
      await this.saveUsers(defaultUsers);
    }

    const requests = await this.getRequests();
    if (requests.length === 0) {
      const defaultRequests = [
        {
          id: 1,
          title: 'Медичне обладнання',
          description: 'Потрібні медичні бинти, знеболюючі, антисептики',
          category: 'medical',
          status: 'pending',
          priority: 'critical',
          authorId: 1,
          authorName: '72-га механізована бригада',
          createdAt: new Date().toISOString(),
          quantity: '50 комплектів',
          image: null
        },
        {
          id: 2,
          title: 'Засоби зв\'язку',
          description: 'Потрібні рації, антени, батареї',
          category: 'communication',
          status: 'completed',
          priority: 'non-critical',
          authorId: 1,
          authorName: '72-га механізована бригада',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          quantity: '20 комплектів',
          image: null
        }
      ];
      await this.saveRequests(defaultRequests);
    }

    const offers = await this.getOffers();
    if (offers.length === 0) {
      const defaultOffers = [
        {
          id: 1,
          title: 'Медичні препарати',
          description: 'Маємо в наявності антисептики, бинти, знеболюючі',
          category: 'medical',
          status: 'available',
          authorId: 2,
          authorName: 'Благодійний фонд "Допомога"',
          createdAt: new Date().toISOString(),
          quantity: '100 комплектів',
          image: null
        }
      ];
      await this.saveOffers(defaultOffers);
    }
  }
}
