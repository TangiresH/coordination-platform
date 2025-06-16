
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Radio, Stethoscope, Apple, Shirt } from 'lucide-react';

interface ItemDetailModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical': return <Stethoscope className="w-16 h-16 text-red-500" />;
      case 'transport': return <Truck className="w-16 h-16 text-blue-500" />;
      case 'surveillance': return <Package className="w-16 h-16 text-purple-500" />;
      case 'communication': return <Radio className="w-16 h-16 text-green-500" />;
      case 'food': return <Apple className="w-16 h-16 text-orange-500" />;
      case 'clothing': return <Shirt className="w-16 h-16 text-pink-500" />;
      default: return <Package className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'available': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Очікує';
      case 'in-progress': return 'В процесі';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Скасовано';
      case 'available': return 'Доступно';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
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

  const getPriorityColor = (priority: string) => {
    return priority === 'critical' ? 'bg-red-500' : 'bg-green-500';
  };

  const getPriorityText = (priority: string) => {
    return priority === 'critical' ? 'Критичний' : 'Не критичний';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Зображення */}
          <div className="flex justify-center">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.title} 
                className="max-w-full max-h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                {getCategoryIcon(item.category)}
              </div>
            )}
          </div>

          {/* Статуси та категорії */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(item.status)}>
              {getStatusText(item.status)}
            </Badge>
            <Badge variant="outline">
              {getCategoryText(item.category)}
            </Badge>
            {item.priority && (
              <Badge className={getPriorityColor(item.priority)}>
                {getPriorityText(item.priority)}
              </Badge>
            )}
          </div>

          {/* Інформація */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700">Кількість:</h4>
              <p>{item.quantity}</p>
              {item.confirmedQuantity && (
                <p className="text-sm text-green-600">Підтверджено: {item.confirmedQuantity}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Автор:</h4>
              <p>{item.authorName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Дата створення:</h4>
              <p>{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Категорія:</h4>
              <p>{getCategoryText(item.category)}</p>
            </div>
            {item.deliveryLocation && (
              <div className="col-span-2">
                <h4 className="font-semibold text-gray-700">Місце доставки:</h4>
                <p>{item.deliveryLocation}</p>
              </div>
            )}
          </div>

          {/* Опис */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Детальний опис:</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{item.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
