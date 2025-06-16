
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, CheckSquare, Heart, Shield } from 'lucide-react';

interface StatisticsCardProps {
  stats: {
    totalRequests: number;
    completedRequests: number;
    activeRequests: number;
    totalOffers: number;
    availableOffers: number;
  };
  userType: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats, userType }) => {
  const completionRate = stats.totalRequests > 0 ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Всього запитів
          </CardTitle>
          <Shield className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRequests}</div>
          <p className="text-xs text-blue-100">
            {userType === 'military' ? 'Ваші запити' : 'В системі'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Завершено
          </CardTitle>
          <CheckSquare className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedRequests}</div>
          <p className="text-xs text-green-100">
            {completionRate}% успішність
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Активні зараз
          </CardTitle>
          <Clock className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeRequests}</div>
          <p className="text-xs text-yellow-100">
            В процесі обробки
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Пропозиції допомоги
          </CardTitle>
          <Heart className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.availableOffers}</div>
          <p className="text-xs text-purple-100">
            З {stats.totalOffers} всього
          </p>
        </CardContent>
      </Card>

      {/* Додаткова статистика */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Загальна активність платформи
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalRequests + stats.totalOffers}</div>
              <div className="text-sm text-gray-600">Всього записів</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">Рівень виконання</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.availableOffers}</div>
              <div className="text-sm text-gray-600">Доступна допомога</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.activeRequests}</div>
              <div className="text-sm text-gray-600">Потребують уваги</div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогрес виконання запитів</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCard;
