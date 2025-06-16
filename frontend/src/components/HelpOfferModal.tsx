
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';

interface HelpOfferModalProps {
  request: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (helpData: any) => void;
}

const HelpOfferModal: React.FC<HelpOfferModalProps> = ({ request, isOpen, onClose, onSubmit }) => {
  const [helpData, setHelpData] = useState({
    message: '',
    contactInfo: '',
    availableQuantity: '',
    deliveryDate: ''
  });

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(helpData);
    setHelpData({ message: '', contactInfo: '', availableQuantity: '', deliveryDate: '' });
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'critical' ? 'bg-red-500' : 'bg-green-500';
  };

  const getPriorityText = (priority: string) => {
    return priority === 'critical' ? 'Критичний' : 'Не критичний';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Запропонувати допомогу</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Інформація про запит */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{request.title}</h3>
            <div className="flex gap-2 mb-2">
              <Badge className={getPriorityColor(request.priority)}>
                {getPriorityText(request.priority)}
              </Badge>
              <Badge variant="outline">
                {getCategoryText(request.category)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
            <p className="text-sm"><strong>Потрібна кількість:</strong> {request.quantity}</p>
            <p className="text-sm"><strong>Від:</strong> {request.authorName}</p>
          </div>

          {/* Форма пропозиції допомоги */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="availableQuantity">Кількість, яку можете надати</Label>
              <Input
                id="availableQuantity"
                value={helpData.availableQuantity}
                onChange={(e) => setHelpData({ ...helpData, availableQuantity: e.target.value })}
                placeholder="Наприклад: 10 комплектів"
                required
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate">Орієнтовна дата доставки</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={helpData.deliveryDate}
                onChange={(e) => setHelpData({ ...helpData, deliveryDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactInfo">Контактна інформація</Label>
              <Input
                id="contactInfo"
                value={helpData.contactInfo}
                onChange={(e) => setHelpData({ ...helpData, contactInfo: e.target.value })}
                placeholder="Телефон, email або інші контакти"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Додаткове повідомлення</Label>
              <Textarea
                id="message"
                value={helpData.message}
                onChange={(e) => setHelpData({ ...helpData, message: e.target.value })}
                placeholder="Додаткова інформація, умови передачі тощо"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Надіслати пропозицію
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Скасувати
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpOfferModal;
