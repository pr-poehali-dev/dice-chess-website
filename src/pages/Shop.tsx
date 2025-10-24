import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/shop', { replace: true });
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [searchParams, navigate]);

  const tokenPackages = [
    { 
      id: 1, 
      tokens: 100, 
      price: 100, 
      popular: false,
      icon: "Coins",
      color: "from-gray-400 to-gray-600"
    },
    { 
      id: 2, 
      tokens: 500, 
      price: 500, 
      popular: true,
      bonus: 50,
      icon: "Gem",
      color: "from-blue-400 to-blue-600"
    },
    { 
      id: 3, 
      tokens: 1000, 
      price: 1000, 
      popular: false,
      bonus: 150,
      icon: "Trophy",
      color: "from-purple-400 to-purple-600"
    },
    { 
      id: 4, 
      tokens: 5000, 
      price: 5000, 
      popular: false,
      bonus: 1000,
      icon: "Crown",
      color: "from-yellow-400 to-yellow-600"
    },
  ];

  const handlePurchase = async (pkg: typeof tokenPackages[0]) => {
    setSelectedPackage(pkg.id);
    setIsProcessing(true);

    try {
      const userId = localStorage.getItem('userId') || '1';
      const totalTokens = pkg.tokens + (pkg.bonus || 0);
      
      const response = await fetch('https://functions.poehali.dev/9d27a5c2-8709-4f55-b120-1157bcf6c1f8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment',
          user_id: parseInt(userId),
          amount: pkg.price,
          tokens: totalTokens
        })
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert('Ошибка создания платежа. Попробуйте позже.');
        setIsProcessing(false);
        setSelectedPackage(null);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка соединения с платёжной системой');
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Icon name="Store" size={36} className="text-yellow-400" />
            Магазин жетонов
          </h1>
          
          <div className="w-24" />
        </div>

        <div className="max-w-6xl mx-auto">
          {showSuccessMessage && (
            <Card className="mb-8 bg-green-900/50 border-green-600 animate-fade-in">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4 text-white">
                  <Icon name="CheckCircle" size={32} className="text-green-400" />
                  <div>
                    <p className="text-xl font-bold">Платёж успешно выполнен!</p>
                    <p className="text-green-300">Жетоны зачислены на ваш баланс</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8 bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 text-white">
                <Icon name="Info" size={24} className="text-blue-400" />
                <p className="text-lg">
                  Курс обмена: <span className="font-bold text-yellow-400">1 рубль = 1 жетон</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative overflow-hidden transition-all hover:scale-105 hover:shadow-2xl ${
                  pkg.popular 
                    ? 'border-yellow-400 border-2 shadow-xl shadow-yellow-400/20' 
                    : 'border-slate-700'
                } bg-slate-800/70`}
              >
                {pkg.popular && (
                  <Badge className="absolute top-3 right-3 bg-yellow-400 text-black font-bold">
                    Популярно
                  </Badge>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                    <Icon name={pkg.icon as any} size={40} className="text-white" />
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-center text-white">
                    {pkg.tokens}
                    {pkg.bonus && (
                      <span className="text-green-400 text-xl ml-2">
                        +{pkg.bonus}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-center text-slate-300 text-lg">
                    жетонов
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {pkg.bonus && (
                    <div className="text-center py-2 bg-green-500/10 rounded-lg border border-green-500/30">
                      <span className="text-green-400 font-bold">
                        🎁 Бонус +{pkg.bonus}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {pkg.price} ₽
                    </div>
                    {pkg.bonus && (
                      <div className="text-sm text-slate-400">
                        Всего: {pkg.tokens + pkg.bonus} жетонов
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full py-6 text-lg font-bold"
                    onClick={() => handlePurchase(pkg)}
                    disabled={isProcessing && selectedPackage === pkg.id}
                  >
                    {isProcessing && selectedPackage === pkg.id ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Icon name="ShoppingCart" size={20} className="mr-2" />
                        Купить
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Icon name="Shield" size={24} className="text-green-400" />
                Безопасная оплата
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={18} className="text-green-400" />
                <span>Защищённое соединение SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={18} className="text-green-400" />
                <span>Мгновенное зачисление жетонов</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={18} className="text-green-400" />
                <span>Поддержка всех банковских карт</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={18} className="text-green-400" />
                <span>Возврат средств в течение 14 дней</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shop;