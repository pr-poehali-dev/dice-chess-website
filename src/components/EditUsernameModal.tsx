import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface EditUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onSuccess: (newUsername: string) => void;
}

export function EditUsernameModal({ isOpen, onClose, currentUsername, onSuccess }: EditUsernameModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === currentUsername) {
      onClose();
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('https://functions.poehali.dev/99f2ac17-e4e8-453c-ac8a-e89e4780bc1b', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка');
        return;
      }

      localStorage.setItem('username', username);
      onSuccess(username);
      onClose();
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Изменить никнейм</DialogTitle>
          <DialogDescription>
            Введите новый никнейм (от 3 до 50 символов)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Никнейм</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите никнейм"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
