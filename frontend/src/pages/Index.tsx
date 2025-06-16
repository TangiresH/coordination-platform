import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Shield, Heart, Plus, Eye, CheckCircle, UserPlus, Upload, Image, TrendingUp, Clock, CheckSquare, Package, Truck, Radio, Stethoscope, Apple, Shirt } from 'lucide-react';
import { toast } from 'sonner';
import ItemDetailModal from '@/components/ItemDetailModal';
import HelpOfferModal from '@/components/HelpOfferModal';
import RegistrationForm from '@/components/RegistrationForm';
import StatisticsCard from '@/components/StatisticsCard';
import { DataService } from '@/services/dataService';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('login');
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [helpOffers, setHelpOffers] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showHelpRequestModal, setShowHelpRequestModal] = useState(false);
  const [helpRequestMessage, setHelpRequestMessage] = useState('');
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'non-critical',
    quantity: '',
    deliveryLocation: '',
    image: null
  });
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    deliveryLocation: '',
    image: null
  });
  const [helpRequestData, setHelpRequestData] = useState({
    message: '',
    requestedQuantity: '',
    contactInfo: ''
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await DataService.initializeData();
        const user = await DataService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await loadData();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    
    initializeApp();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, offersData, helpOffersData, helpRequestsData] = await Promise.all([
        DataService.getRequests(),
        DataService.getOffers(),
        DataService.getHelpOffers(),
        DataService.getHelpRequests()
      ]);
      
      setRequests(requestsData);
      setOffers(offersData);
      setHelpOffers(helpOffersData);
      setHelpRequests(helpRequestsData);
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Помилка завантаження даних');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await DataService.login(loginData.email, loginData.password);
      
      if (user) {
        setCurrentUser(user);
        await loadData();
        toast.success('Успішний вхід в систему!');
      } else {
        toast.error('Невірний email або пароль');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Помилка входу в систему');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const existingUsers = await DataService.getUsers();
      const existingUser = existingUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        toast.error('Користувач з таким email вже існує');
        return;
      }

      await DataService.registerUser(userData);
      toast.success('Реєстрацію завершено! Тепер увійдіть в систему.');
      setShowRegistration(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Помилка реєстрації');
    }
  };

  const handleLogout = async () => {
    try {
      await DataService.logout();
      setCurrentUser(null);
      toast.success('Ви вийшли з системи');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await DataService.uploadImage(file);
        if (type === 'request') {
          setNewRequest({ ...newRequest, image: result.url });
        } else {
          setNewOffer({ ...newOffer, image: result.url });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Помилка завантаження зображення');
        
        // Fallback to local base64 conversion
        const reader = new FileReader();
        reader.onload = (event) => {
          if (type === 'request') {
            setNewRequest({ ...newRequest, image: event.target.result });
          } else {
            setNewOffer({ ...newOffer, image: event.target.result });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const newRequestObj = {
        ...newRequest,
        status: 'pending',
        authorId: currentUser.id,
        authorName: currentUser.name,
      };
      
      await DataService.createRequest(newRequestObj);
      await loadData();
      setNewRequest({ title: '', description: '', category: '', priority: 'non-critical', quantity: '', deliveryLocation: '', image: null });
      toast.success('Запит створено успішно!');
    } catch (error) {
      console.error('Create request error:', error);
      toast.error('Помилка створення запиту');
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      const newOfferObj = {
        ...newOffer,
        status: 'available',
        authorId: currentUser.id,
        authorName: currentUser.name,
      };
      
      await DataService.createOffer(newOfferObj);
      await loadData();
      setNewOffer({ title: '', description: '', category: '', quantity: '', deliveryLocation: '', image: null });
      toast.success('Пропозицію створено успішно!');
    } catch (error) {
      console.error('Create offer error:', error);
      toast.error('Помилка створення пропозиції');
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await DataService.updateRequest(requestId, { status: newStatus });
      await loadData();
      toast.success('Статус оновлено!');
    } catch (error) {
      console.error('Update request status error:', error);
      toast.error('Помилка оновлення статусу');
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleOfferHelp = (request) => {
    setSelectedItem(request);
    setShowOfferModal(true);
  };

  const handleSubmitHelp = async (helpData) => {
    try {
      const newHelpOffer = {
        requestId: selectedItem.id,
        requestTitle: selectedItem.title,
        volunteerName: currentUser.name,
        volunteerId: currentUser.id,
        militaryId: selectedItem.authorId,
        militaryName: selectedItem.authorName,
        status: 'pending',
        ...helpData
      };
      
      await DataService.addHelpOffer(newHelpOffer);
      await loadData();
      toast.success('Вашу пропозицію допомоги надіслано!');
      setShowOfferModal(false);
    } catch (error) {
      console.error('Submit help error:', error);
      toast.error('Помилка відправки пропозиції');
    }
  };

  const handleAcceptHelp = async (helpOfferId, acceptedQuantity) => {
    try {
      const helpOffers = await DataService.getHelpOffers();
      const requests = await DataService.getRequests();
      const offers = await DataService.getOffers();
      
      // Знаходимо пропозицію допомоги
      const helpOffer = helpOffers.find(offer => offer.id === helpOfferId);
      if (!helpOffer) return;

      // Оновлюємо статус пропозиції допомоги
      await DataService.updateHelpOffer(helpOfferId, { status: 'accepted', acceptedQuantity });

      // Знаходимо відповідний запит
      const request = requests.find(req => req.id === helpOffer.requestId);
      if (request) {
        const currentQuantity = parseInt(request.quantity) || 0;
        const acceptedQty = parseInt(acceptedQuantity) || 0;
        const remainingQuantity = currentQuantity - acceptedQty;

        if (remainingQuantity <= 0) {
          await DataService.updateRequest(request.id, { status: 'completed' });
        } else {
          await DataService.updateRequest(request.id, { 
            quantity: `${remainingQuantity} ${request.quantity.split(' ').slice(1).join(' ')}`,
            status: 'in-progress'
          });
        }
      }

      // Якщо це була пропозиція від благодійної організації, оновлюємо її кількість
      if (helpOffer.volunteerId) {
        const offer = offers.find(off => off.authorId === helpOffer.volunteerId);
        if (offer) {
          const currentOfferQuantity = parseInt(offer.quantity) || 0;
          const remainingOfferQuantity = currentOfferQuantity - parseInt(acceptedQuantity);
          
          if (remainingOfferQuantity <= 0) {
            // Тут можна видалити пропозицію, але це потребує додаткового API методу
            await DataService.updateOffer(offer.id, { status: 'exhausted' });
          } else {
            await DataService.updateOffer(offer.id, { 
              quantity: `${remainingOfferQuantity} ${offer.quantity.split(' ').slice(1).join(' ')}`
            });
          }
        }
      }

      await loadData();
      toast.success('Допомогу прийнято!');
    } catch (error) {
      console.error('Accept help error:', error);
      toast.error('Помилка прийняття допомоги');
    }
  };

  const handleRequestHelp = (offer) => {
    setSelectedItem(offer);
    setShowHelpRequestModal(true);
    setHelpRequestData({ message: '', requestedQuantity: '', contactInfo: '' });
  };

  const handleSubmitHelpRequest = async () => {
    try {
      const newHelpRequest = {
        offerId: selectedItem.id,
        offerTitle: selectedItem.title,
        militaryName: currentUser.name,
        militaryId: currentUser.id,
        charityId: selectedItem.authorId,
        charityName: selectedItem.authorName,
        status: 'pending',
        requestedQuantity: helpRequestData.requestedQuantity,
        message: helpRequestData.message,
        contactInfo: helpRequestData.contactInfo
      };
      
      await DataService.addHelpRequest(newHelpRequest);
      await loadData();
      toast.success('Ваш запит на допомогу надіслано!');
      setShowHelpRequestModal(false);
      setHelpRequestData({ message: '', requestedQuantity: '', contactInfo: '' });
    } catch (error) {
      console.error('Submit help request error:', error);
      toast.error('Помилка відправки запиту');
    }
  };

  const handleConfirmHelpRequest = async (helpRequestId, confirmedQuantity) => {
    try {
      const helpRequests = await DataService.getHelpRequests();
      const offers = await DataService.getOffers();
      
      const helpRequest = helpRequests.find(request => request.id === helpRequestId);
      if (!helpRequest) return;

      await DataService.updateHelpRequest(helpRequestId, { status: 'confirmed', confirmedQuantity });

      const offer = offers.find(off => off.id === helpRequest.offerId);
      if (offer) {
        const currentQuantity = parseInt(offer.quantity) || 0;
        const confirmedQty = parseInt(confirmedQuantity) || 0;
        const remainingQuantity = currentQuantity - confirmedQty;

        if (remainingQuantity <= 0) {
          await DataService.updateOffer(offer.id, { status: 'exhausted' });
        } else {
          await DataService.updateOffer(offer.id, { 
            quantity: `${remainingQuantity} ${offer.quantity.split(' ').slice(1).join(' ')}`
          });
        }
      }

      await loadData();
      toast.success('Запит на допомогу підтверджено!');
    } catch (error) {
      console.error('Confirm help request error:', error);
      toast.error('Помилка підтвердження запиту');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medical': return <Stethoscope className="w-6 h-6 text-red-500" />;
      case 'transport': return <Truck className="w-6 h-6 text-blue-500" />;
      case 'surveillance': return <Eye className="w-6 h-6 text-purple-500" />;
      case 'communication': return <Radio className="w-6 h-6 text-green-500" />;
      case 'food': return <Apple className="w-6 h-6 text-orange-500" />;
      case 'clothing': return <Shirt className="w-6 h-6 text-pink-500" />;
      default: return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Очікує';
      case 'in-progress': return 'В процесі';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Скасовано';
      case 'available': return 'Доступно';
      default: return status;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'medical': return 'Медичне обладнання';
      case 'transport': return 'Транспорт';
      case 'surveillance': return 'Спостереження';
      case 'communication': return 'Зв\'язок';
      case 'food': return 'Продукти харчування';
      case 'clothing': return 'Одяг';
      default: return category;
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'critical' ? 'bg-red-500' : 'bg-green-500';
  };

  const getPriorityText = (priority) => {
    return priority === 'critical' ? 'Критичний' : 'Не критичний';
  };

  const getStatistics = () => {
    const totalRequests = requests.length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    const activeRequests = requests.filter(r => r.status === 'pending' || r.status === 'in-progress').length;
    const totalOffers = offers.length;
    const availableOffers = offers.filter(o => o.status === 'available').length;
    const pendingHelpRequests = helpRequests.filter(hr => hr.status === 'pending').length;

    return {
      totalRequests,
      completedRequests,
      activeRequests,
      totalOffers,
      availableOffers,
      pendingHelpRequests
    };
  };

  if (!currentUser && !showRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Платформа координації допомоги</CardTitle>
            <p className="text-gray-600">Синхронізація між військовими підрозділами та благодійними організаціями</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Увійти</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowRegistration(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Реєстрація
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Тестові акаунти:</h4>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Військовий підрозділ:</strong><br />
                  Email: military@army.ua<br />
                  Пароль: 123456
                </div>
                <div>
                  <strong>Благодійна організація:</strong><br />
                  Email: volunteer@help.org<br />
                  Пароль: 123456
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <RegistrationForm 
        onRegister={handleRegister}
        onBack={() => setShowRegistration(false)}
      />
    );
  }

  const stats = getStatistics();

  // Сортування запитів: активні спочатку
  const sortedMyRequests = requests
    .filter(req => req.authorId === currentUser.id)
    .sort((a, b) => {
      const priorityOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2, 'cancelled': 3 };
      return priorityOrder[a.status] - priorityOrder[b.status];
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {currentUser.type === 'military' ? (
                <Shield className="h-8 w-8 text-blue-600" />
              ) : (
                <Heart className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">Платформа координації</h1>
                <p className="text-sm text-gray-600">{currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>Вийти</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="create">
              {currentUser.type === 'military' ? 'Створити запит' : 'Створити пропозицію'}
            </TabsTrigger>
            <TabsTrigger value="browse">
              {currentUser.type === 'military' ? 'Пропозиції допомоги' : 'Запити допомоги'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatisticsCard stats={stats} userType={currentUser.type} />

            <div className="space-y-6">
              {currentUser.type === 'military' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Мої запити</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sortedMyRequests.map(request => (
                          <div key={request.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-3">
                                {request.image ? (
                                  <img src={request.image} alt={request.title} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                    {getCategoryIcon(request.category)}
                                  </div>
                                )}
                                <h4 className="font-semibold">{request.title}</h4>
                              </div>
                              <div className="flex space-x-2">
                                <Badge className={getStatusColor(request.status)}>
                                  {getStatusText(request.status)}
                                </Badge>
                                <Badge className={getPriorityColor(request.priority)}>
                                  {getPriorityText(request.priority)}
                                </Badge>
                                <Badge variant="outline">{getCategoryText(request.category)}</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">{request.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                              <span>Кількість: {request.quantity}</span>
                              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewDetails(request)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Деталі
                              </Button>
                              {request.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateRequestStatus(request.id, 'in-progress')}
                                >
                                  В процесі
                                </Button>
                              )}
                              {(request.status === 'pending' || request.status === 'in-progress') && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateRequestStatus(request.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Завершити
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Пропозиції допомоги від волонтерів */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Пропозиції допомоги від волонтерів</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {helpOffers.filter(offer => offer.militaryId === currentUser.id).map(helpOffer => (
                          <div key={helpOffer.id} className="border rounded-lg p-4 bg-blue-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">Допомога для: {helpOffer.requestTitle}</h4>
                              <Badge className={helpOffer.status === 'pending' ? 'bg-blue-500' : 'bg-green-500'}>
                                {helpOffer.status === 'pending' ? 'Нова пропозиція' : 'Прийнято'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">Від: {helpOffer.volunteerName}</p>
                            <p className="text-sm mb-2"><strong>Пропонована кількість:</strong> {helpOffer.availableQuantity}</p>
                            <p className="text-sm mb-2"><strong>Дата доставки:</strong> {helpOffer.deliveryDate ? new Date(helpOffer.deliveryDate).toLocaleDateString() : ''}</p>
                            <p className="text-sm mb-2"><strong>Контакт:</strong> {helpOffer.contactInfo}</p>
                            {helpOffer.message && (
                              <p className="text-sm mb-2"><strong>Повідомлення:</strong> {helpOffer.message}</p>
                            )}
                            {helpOffer.status === 'pending' && (
                              <div className="mt-3 flex gap-2">
                                <Input 
                                  placeholder="Кількість для прийняття"
                                  className="flex-1"
                                  id={`accept-quantity-${helpOffer.id}`}
                                />
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    const input = document.getElementById(`accept-quantity-${helpOffer.id}`) as HTMLInputElement;
                                    const quantity = input?.value || helpOffer.availableQuantity;
                                    handleAcceptHelp(helpOffer.id, quantity);
                                  }}
                                >
                                  Прийняти
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        {helpOffers.filter(offer => offer.militaryId === currentUser.id).length === 0 && (
                          <p className="text-gray-500 text-center py-8">Поки що немає пропозицій допомоги</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Запити ресурсів від благодійних організацій */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Запити ресурсів від благодійних організацій</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {helpRequests.filter(request => request.militaryId === currentUser.id).map(helpRequest => (
                          <div key={helpRequest.id} className="border rounded-lg p-4 bg-green-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">Запит на: {helpRequest.offerTitle}</h4>
                              <Badge className={helpRequest.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
                                {helpRequest.status === 'pending' ? 'Очікує відповіді' : 'Підтверджено'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">До: {helpRequest.charityName}</p>
                            <p className="text-sm mb-2"><strong>Запитувана кількість:</strong> {helpRequest.requestedQuantity}</p>
                            {helpRequest.confirmedQuantity && (
                              <p className="text-sm mb-2 text-green-600"><strong>Підтверджена кількість:</strong> {helpRequest.confirmedQuantity}</p>
                            )}
                            <p className="text-sm mb-2"><strong>Дата запиту:</strong> {new Date(helpRequest.createdAt).toLocaleDateString()}</p>
                            {helpRequest.contactInfo && (
                              <p className="text-sm mb-2"><strong>Контакт:</strong> {helpRequest.contactInfo}</p>
                            )}
                            {helpRequest.message && (
                              <p className="text-sm mb-2"><strong>Повідомлення:</strong> {helpRequest.message}</p>
                            )}
                          </div>
                        ))}
                        {helpRequests.filter(request => request.militaryId === currentUser.id).length === 0 && (
                          <p className="text-gray-500 text-center py-8">Поки що немає запитів на допомогу</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {currentUser.type === 'charity' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Мої пропозиції</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {offers.filter(offer => offer.authorId === currentUser.id).map(offer => (
                          <div key={offer.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-3">
                                {offer.image ? (
                                  <img src={offer.image} alt={offer.title} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                    {getCategoryIcon(offer.category)}
                                  </div>
                                )}
                                <h4 className="font-semibold">{offer.title}</h4>
                              </div>
                              <div className="flex space-x-2">
                                <Badge className={getStatusColor(offer.status)}>
                                  {getStatusText(offer.status)}
                                </Badge>
                                <Badge variant="outline">{getCategoryText(offer.category)}</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">{offer.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                              <span>Від: {offer.authorName}</span>
                              <span>Кількість: {offer.quantity}</span>
                              <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(offer)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Деталі
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Запити на допомогу від військових */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Запити на допомогу від військових</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {helpRequests.filter(request => request.charityId === currentUser.id).map(helpRequest => (
                          <div key={helpRequest.id} className="border rounded-lg p-4 bg-yellow-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">Запит на: {helpRequest.offerTitle}</h4>
                              <Badge className={helpRequest.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
                                {helpRequest.status === 'pending' ? 'Новий запит' : 'Підтверджено'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">Від: {helpRequest.militaryName}</p>
                            <p className="text-sm mb-2"><strong>Запитувана кількість:</strong> {helpRequest.requestedQuantity}</p>
                            {helpRequest.confirmedQuantity && (
                              <p className="text-sm mb-2 text-green-600"><strong>Підтверджена кількість:</strong> {helpRequest.confirmedQuantity}</p>
                            )}
                            <p className="text-sm mb-2"><strong>Дата запиту:</strong> {new Date(helpRequest.createdAt).toLocaleDateString()}</p>
                            {helpRequest.contactInfo && (
                              <p className="text-sm mb-2"><strong>Контакт:</strong> {helpRequest.contactInfo}</p>
                            )}
                            {helpRequest.message && (
                              <p className="text-sm mb-2"><strong>Повідомлення:</strong> {helpRequest.message}</p>
                            )}
                            {helpRequest.status === 'pending' && (
                              <div className="mt-3 flex gap-2">
                                <Input 
                                  placeholder="Кількість, яку в змозі надати"
                                  className="flex-1"
                                  id={`confirm-quantity-${helpRequest.id}`}
                                />
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    const input = document.getElementById(`confirm-quantity-${helpRequest.id}`) as HTMLInputElement;
                                    const quantity = input?.value || helpRequest.requestedQuantity;
                                    handleConfirmHelpRequest(helpRequest.id, quantity);
                                  }}
                                >
                                  Підтвердити
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        {helpRequests.filter(request => request.charityId === currentUser.id).length === 0 && (
                          <p className="text-gray-500 text-center py-8">Поки що немає запитів на допомогу</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentUser.type === 'military' ? 'Створити запит на допомогу' : 'Створити пропозицію допомоги'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser.type === 'military' ? (
                  <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Назва запиту</Label>
                      <Input
                        id="title"
                        value={newRequest.title}
                        onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                        placeholder="Короткий опис потреби"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Категорія</Label>
                      <Select value={newRequest.category} onValueChange={(value) => setNewRequest({ ...newRequest, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть категорію" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Медичне обладнання</SelectItem>
                          <SelectItem value="transport">Транспорт</SelectItem>
                          <SelectItem value="surveillance">Засоби спостереження</SelectItem>
                          <SelectItem value="communication">Засоби зв'язку</SelectItem>
                          <SelectItem value="food">Продукти харчування</SelectItem>
                          <SelectItem value="clothing">Одяг та екіпірування</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Пріоритет</Label>
                      <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non-critical">Не критичний</SelectItem>
                          <SelectItem value="critical">Критичний</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Кількість</Label>
                      <Input
                        id="quantity"
                        value={newRequest.quantity}
                        onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                        placeholder="Скільки потрібно"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="deliveryLocation">Місце доставки</Label>
                      <Input
                        id="deliveryLocation"
                        value={newRequest.deliveryLocation}
                        onChange={(e) => setNewRequest({ ...newRequest, deliveryLocation: e.target.value })}
                        placeholder="Адреса або місце доставки"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Фото предмету (необов'язково)</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'request')}
                          className="flex-1"
                          placeholder="Оберіть файл (файл не обрано)"
                          style={{ '::file-selector-button': { display: 'none' } } }
                        />
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                      {newRequest.image && (
                        <div className="mt-2">
                          <img src={newRequest.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Детальний опис</Label>
                      <Textarea
                        id="description"
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                        placeholder="Докладний опис потреби, специфікації, терміни тощо"
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Створити запит
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleCreateOffer} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Назва пропозиції</Label>
                      <Input
                        id="title"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                        placeholder="Короткий опис того, що пропонуєте"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Категорія</Label>
                      <Select value={newOffer.category} onValueChange={(value) => setNewOffer({ ...newOffer, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть категорію" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Медичне обладнання</SelectItem>
                          <SelectItem value="transport">Транспорт</SelectItem>
                          <SelectItem value="surveillance">Засоби спостереження</SelectItem>
                          <SelectItem value="communication">Засоби зв'язку</SelectItem>
                          <SelectItem value="food">Продукти харчування</SelectItem>
                          <SelectItem value="clothing">Одяг та екіпірування</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Кількість</Label>
                      <Input
                        id="quantity"
                        value={newOffer.quantity}
                        onChange={(e) => setNewOffer({ ...newOffer, quantity: e.target.value })}
                        placeholder="Скільки можете надати"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="deliveryLocation">Місце відправки/зустрічі</Label>
                      <Input
                        id="deliveryLocation"
                        value={newOffer.deliveryLocation}
                        onChange={(e) => setNewOffer({ ...newOffer, deliveryLocation: e.target.value })}
                        placeholder="Звідки можете відправити або де зустрітися"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Фото предмету (необов'язково)</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'offer')}
                          className="flex-1"
                        />
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                      {newOffer.image && (
                        <div className="mt-2">
                          <img src={newOffer.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Детальний опис</Label>
                      <Textarea
                        id="description"
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                        placeholder="Докладний опис пропозиції, умови передачі тощо"
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Створити пропозицію
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentUser.type === 'military' ? 'Доступні пропозиції допомоги' : 'Запити на допомогу'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.type === 'military' ? (
                    offers.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Поки що немає доступних пропозицій</p>
                    ) : (
                      offers.map(offer => (
                        <div key={offer.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                              {offer.image ? (
                                <img src={offer.image} alt={offer.title} className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                  {getCategoryIcon(offer.category)}
                                </div>
                              )}
                              <h4 className="font-semibold">{offer.title}</h4>
                            </div>
                            <div className="flex space-x-2">
                              <Badge className={getStatusColor(offer.status)}>
                                {getStatusText(offer.status)}
                              </Badge>
                              <Badge variant="outline">{getCategoryText(offer.category)}</Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{offer.description}</p>
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                            <span>Від: {offer.authorName}</span>
                            <span>Кількість: {offer.quantity}</span>
                            <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(offer)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Деталі
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1" 
                              onClick={() => handleRequestHelp(offer)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Залишити запит
                            </Button>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    requests.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Поки що немає запитів на допомогу</p>
                    ) : (
                      requests.map(request => (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                              {request.image ? (
                                <img src={request.image} alt={request.title} className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                  {getCategoryIcon(request.category)}
                                </div>
                              )}
                              <h4 className="font-semibold">{request.title}</h4>
                            </div>
                            <div className="flex space-x-2">
                              <Badge className={getStatusColor(request.status)}>
                                {getStatusText(request.status)}
                              </Badge>
                              <Badge className={getPriorityColor(request.priority)}>
                                {getPriorityText(request.priority)}
                              </Badge>
                              <Badge variant="outline">{getCategoryText(request.category)}</Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                            <span>Від: {request.authorName}</span>
                            <span>Кількість: {request.quantity}</span>
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(request)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Деталі
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1" 
                              onClick={() => handleOfferHelp(request)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Запропонувати допомогу
                            </Button>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальні вікна */}
      <ItemDetailModal 
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <HelpOfferModal 
        request={selectedItem}
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSubmit={handleSubmitHelp}
      />

      {/* Модальне вікно для запиту допомоги */}
      {showHelpRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Запит на допомогу</CardTitle>
              <p className="text-sm text-gray-600">Запит ресурсу: {selectedItem?.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="requestedQuantity">Потрібна кількість</Label>
                <Input
                  id="requestedQuantity"
                  value={helpRequestData.requestedQuantity}
                  onChange={(e) => setHelpRequestData({ ...helpRequestData, requestedQuantity: e.target.value })}
                  placeholder="Скільки потрібно"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactInfo">Контактна інформація</Label>
                <Input
                  id="contactInfo"
                  value={helpRequestData.contactInfo}
                  onChange={(e) => setHelpRequestData({ ...helpRequestData, contactInfo: e.target.value })}
                  placeholder="Телефон, email або інші контакти"
                  required
                />
              </div>
              <div>
                <Label htmlFor="helpMessage">Повідомлення (необов'язково)</Label>
                <Textarea
                  id="helpMessage"
                  value={helpRequestData.message}
                  onChange={(e) => setHelpRequestData({ ...helpRequestData, message: e.target.value })}
                  placeholder="Додайте повідомлення до вашого запиту..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmitHelpRequest} className="flex-1">
                  Надіслати запит
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowHelpRequestModal(false)}
                  className="flex-1"
                >
                  Скасувати
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
