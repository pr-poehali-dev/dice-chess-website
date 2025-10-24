import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('tokens');
    return saved ? parseInt(saved) : 350;
  });
  const [selectedBet, setSelectedBet] = useState(100);
  const [selectedTime, setSelectedTime] = useState("3+0");
  const [adsWatched, setAdsWatched] = useState(() => {
    const saved = localStorage.getItem('adsWatched');
    const lastDate = localStorage.getItem('adsWatchedDate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      localStorage.setItem('adsWatchedDate', today);
      return 0;
    }
    return saved ? parseInt(saved) : 0;
  });
  const [dailyClaimedToday, setDailyClaimedToday] = useState(() => {
    const lastClaim = localStorage.getItem('dailyClaimDate');
    const today = new Date().toDateString();
    return lastClaim === today;
  });

  useEffect(() => {
    localStorage.setItem('tokens', tokens.toString());
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('adsWatched', adsWatched.toString());
  }, [adsWatched]);

  const playerStats = {
    name: "Игрок_12345",
    rating: 1000,
    rank: 0,
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    bestWinStreak: 0,
    currentStreak: 0,
    tokensWon: 0,
    tokensLost: 0
  };

  const achievements = [
    { id: 1, title: "Первая победа", description: "Выиграйте свою первую игру", icon: "Trophy", unlocked: false, progress: 0 },
    { id: 2, title: "Победная серия", description: "Выиграйте 5 игр подряд", icon: "Flame", unlocked: false, progress: 0 },
    { id: 3, title: "Мастер блица", description: "Выиграйте 50 блиц-партий", icon: "Zap", unlocked: false, progress: 0 },
    { id: 4, title: "Миллионер", description: "Накопите 10000 жетонов", icon: "Coins", unlocked: false, progress: 0 },
    { id: 5, title: "Легенда", description: "Достигните рейтинга 2500", icon: "Star", unlocked: false, progress: 0 },
    { id: 6, title: "Марафонец", description: "Сыграйте 500 игр", icon: "Target", unlocked: false, progress: 0 },
  ];

  const recentGames: any[] = [];

  const tournaments: any[] = [];

  const leaderboard: any[] = [];

  const lobbyGames: any[] = [];

  const timeControls = [
    { value: "1+0", label: "1 мин", icon: "Zap" },
    { value: "3+0", label: "3 мин", icon: "Zap" },
    { value: "3+2", label: "3+2", icon: "Clock" },
    { value: "5+0", label: "5 мин", icon: "Clock" },
    { value: "5+3", label: "5+3", icon: "Clock" },
    { value: "10+0", label: "10 мин", icon: "Timer" },
    { value: "10+5", label: "10+5", icon: "Timer" },
    { value: "15+10", label: "15+10", icon: "Timer" },
  ];

  const handleClaimDaily = () => {
    if (!dailyClaimedToday) {
      setTokens(tokens + 100);
      setDailyClaimedToday(true);
      const today = new Date().toDateString();
      localStorage.setItem('dailyClaimDate', today);
    }
  };

  const handleWatchAd = () => {
    if (adsWatched < 5) {
      setTokens(tokens + 50);
      setAdsWatched(adsWatched + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">DICE CHESS</div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-accent text-accent-foreground px-4 py-2 text-base font-semibold">
              <Icon name="Coins" size={18} className="mr-2" />
              {tokens} жетонов
            </Badge>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-muted/30 border-b sticky top-[72px] z-40">
          <div className="container mx-auto px-4">
            <TabsList className="w-full justify-start bg-transparent h-14 gap-2">
              <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base">
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </TabsTrigger>
              <TabsTrigger value="play" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base">
                <Icon name="Play" size={18} className="mr-2" />
                Играть
              </TabsTrigger>
              <TabsTrigger value="lobby" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base">
                <Icon name="Users" size={18} className="mr-2" />
                Лобби
              </TabsTrigger>
              <TabsTrigger value="shop" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base">
                <Icon name="ShoppingBag" size={18} className="mr-2" />
                Магазин
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 text-base">
                <Icon name="User" size={18} className="mr-2" />
                Профиль
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="home" className="mt-0">
          <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 px-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left animate-fade-in">
                  <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse-slow">
                    Онлайн сейчас: 1,234 игрока
                  </Badge>
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                    DICE CHESS
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    Стратегия встречает удачу в захватывающей игре, где каждый бросок кубика определяет судьбу партии
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button 
                      size="lg" 
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      onClick={() => setActiveTab("play")}
                    >
                      <Icon name="Play" className="mr-2" size={24} />
                      Играть сейчас
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 backdrop-blur-sm"
                      onClick={() => setActiveTab("lobby")}
                    >
                      <Icon name="Users" className="mr-2" size={24} />
                      Открыть лобби
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 flex justify-center items-center animate-scale-in">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/30 blur-3xl rounded-full animate-pulse-slow"></div>
                    <img 
                      src="https://v3b.fal.media/files/b/koala/42UxSVuDvs4naZk3ZIB9-_output.png" 
                      alt="Dice Chess" 
                      className="relative w-full max-w-md rounded-2xl shadow-2xl animate-float"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Ближайшие турниры</h2>
                  <p className="text-muted-foreground text-lg">Примите участие и выиграйте призы</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament, index) => (
                  <Card 
                    key={tournament.id} 
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-accent text-accent-foreground">{tournament.status}</Badge>
                        <Badge variant="outline" className="border-secondary text-secondary">
                          <Icon name="Trophy" size={14} className="mr-1" />
                          {tournament.prize}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{tournament.title}</CardTitle>
                      <CardDescription className="text-sm">{tournament.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Icon name="Calendar" size={16} className="mr-2 text-muted-foreground" />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Icon name="Users" size={16} className="mr-2 text-muted-foreground" />
                          <span>{tournament.participants} / {tournament.maxParticipants} участников</span>
                        </div>
                      </div>
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        Зарегистрироваться
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Таблица лидеров</h2>
                  <p className="text-muted-foreground text-lg">Топ игроков по рейтингу</p>
                </div>
              </div>

              <Card className="overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Место</th>
                        <th className="px-6 py-4 text-left font-semibold">Игрок</th>
                        <th className="px-6 py-4 text-left font-semibold">Рейтинг</th>
                        <th className="px-6 py-4 text-left font-semibold">Побед</th>
                        <th className="px-6 py-4 text-left font-semibold">Достижения</th>
                        <th className="px-6 py-4 text-left font-semibold">Тренд</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((player, index) => (
                        <tr 
                          key={player.rank} 
                          className="border-t hover:bg-muted/30 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {player.rank <= 3 ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  player.rank === 1 ? 'bg-accent text-accent-foreground' :
                                  player.rank === 2 ? 'bg-muted text-muted-foreground' :
                                  'bg-secondary/30 text-secondary'
                                }`}>
                                  {player.rank}
                                </div>
                              ) : (
                                <span className="w-8 text-center font-semibold text-muted-foreground">{player.rank}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">{player.name}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="font-mono text-base">
                              {player.rating}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{player.wins}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="gap-1">
                              <Icon name="Award" size={14} />
                              {player.achievements}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {player.trend === 'up' && <Icon name="TrendingUp" className="text-green-500" size={20} />}
                            {player.trend === 'down' && <Icon name="TrendingDown" className="text-red-500" size={20} />}
                            {player.trend === 'same' && <Icon name="Minus" className="text-muted-foreground" size={20} />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="play" className="mt-0">
          <div className="container mx-auto max-w-4xl px-4 py-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4">Создать игру</h2>
              <p className="text-xl text-muted-foreground">Выберите ставку и временной контроль</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Coins" size={24} className="text-accent" />
                    Ставка
                  </CardTitle>
                  <CardDescription>Выберите количество жетонов для игры</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Введите ставку</label>
                    <Input
                      type="number"
                      value={selectedBet}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value >= 0 && value <= tokens) {
                          setSelectedBet(value);
                        }
                      }}
                      min={0}
                      max={tokens}
                      className="text-2xl font-bold text-center h-16"
                      placeholder="Введите ставку"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      Доступно: {tokens} жетонов
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000, 2000, 3000, 5000].map((bet) => (
                      <Button
                        key={bet}
                        variant={selectedBet === bet ? "default" : "outline"}
                        onClick={() => bet <= tokens && setSelectedBet(bet)}
                        disabled={bet > tokens}
                        className={selectedBet === bet ? "bg-primary" : ""}
                      >
                        {bet}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Clock" size={24} className="text-primary" />
                    Временной контроль
                  </CardTitle>
                  <CardDescription>Выберите формат игры по времени</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeControls.map((time) => (
                      <Button
                        key={time.value}
                        variant={selectedTime === time.value ? "default" : "outline"}
                        onClick={() => setSelectedTime(time.value)}
                        className={`h-auto py-4 flex flex-col gap-1 ${selectedTime === time.value ? "bg-primary" : ""}`}
                      >
                        <Icon name={time.icon as any} size={20} />
                        <span className="font-semibold">{time.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 animate-fade-in border-2 border-primary/20" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Готовы начать?</h3>
                    <p className="text-muted-foreground">Ваши настройки игры</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Ставка</div>
                    <Badge className="text-xl px-4 py-2 bg-accent text-accent-foreground">
                      <Icon name="Coins" size={16} className="mr-1" />
                      {selectedBet}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center mb-6">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    <Icon name="Clock" size={16} className="mr-2" />
                    {selectedTime}
                  </Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">
                    У вас: {tokens} жетонов
                  </Badge>
                </div>

                <Button 
                  size="lg" 
                  className="w-full text-xl py-7 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
                  disabled={tokens < selectedBet}
                >
                  <Icon name="Play" size={24} className="mr-2" />
                  {tokens < selectedBet ? "Недостаточно жетонов" : "Создать игру"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lobby" className="mt-0">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4">Лобби игр</h2>
              <p className="text-xl text-muted-foreground">Присоединяйтесь к существующим играм</p>
            </div>

            <div className="space-y-4">
              {lobbyGames.map((game, index) => (
                <Card 
                  key={game.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                          {game.player.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{game.player}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="font-mono">
                              {game.rating}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Ставка</div>
                          <Badge className="bg-accent text-accent-foreground text-base px-3 py-1">
                            <Icon name="Coins" size={14} className="mr-1" />
                            {game.bet}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Время</div>
                          <Badge variant="outline" className="text-base px-3 py-1">
                            <Icon name="Clock" size={14} className="mr-1" />
                            {game.time}
                          </Badge>
                        </div>

                        <Button 
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          disabled={tokens < game.bet}
                        >
                          <Icon name="Swords" size={18} className="mr-2" />
                          Принять вызов
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {lobbyGames.length === 0 && (
              <Card className="py-16">
                <CardContent className="text-center">
                  <Icon name="Users" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-bold mb-2">Лобби пусто</h3>
                  <p className="text-muted-foreground mb-6">Пока никто не ищет игру. Создайте свою!</p>
                  <Button onClick={() => setActiveTab("play")} className="bg-primary">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Создать игру
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shop" className="mt-0">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4">Магазин жетонов</h2>
              <p className="text-xl text-muted-foreground">Получайте бесплатные жетоны каждый день</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-2 border-accent/50 animate-scale-in">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Icon name="Gift" size={32} className="text-accent-foreground" />
                  </div>
                  <CardTitle className="text-3xl text-center">Ежедневный бонус</CardTitle>
                  <CardDescription className="text-center text-base">Получайте 100 жетонов каждый день бесплатно</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-accent mb-2">+100</div>
                    <div className="text-muted-foreground">жетонов</div>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleClaimDaily}
                    disabled={dailyClaimedToday}
                  >
                    {dailyClaimedToday ? (
                      <>
                        <Icon name="Check" size={20} className="mr-2" />
                        Получено сегодня
                      </>
                    ) : (
                      <>
                        <Icon name="Gift" size={20} className="mr-2" />
                        Забрать бонус
                      </>
                    )}
                  </Button>
                  {dailyClaimedToday && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Приходите завтра за новым бонусом!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/50 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Icon name="Video" size={32} className="text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-3xl text-center">Смотреть рекламу</CardTitle>
                  <CardDescription className="text-center text-base">До 5 просмотров в день по 50 жетонов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-secondary mb-2">+50</div>
                    <div className="text-muted-foreground">жетонов за просмотр</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Просмотрено сегодня</span>
                      <span className="font-semibold">{adsWatched} / 5</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary transition-all duration-500"
                        style={{ width: `${(adsWatched / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={handleWatchAd}
                    disabled={adsWatched >= 5}
                  >
                    {adsWatched >= 5 ? (
                      <>
                        <Icon name="Check" size={20} className="mr-2" />
                        Лимит достигнут
                      </>
                    ) : (
                      <>
                        <Icon name="Play" size={20} className="mr-2" />
                        Смотреть рекламу ({5 - adsWatched})
                      </>
                    )}
                  </Button>
                  {adsWatched >= 5 && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Возвращайтесь завтра за новыми просмотрами!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Info" size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">Как получать жетоны?</h3>
                  <div className="space-y-3 text-left max-w-2xl mx-auto text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                      <p>Забирайте <strong className="text-foreground">100 жетонов каждый день</strong> — просто нажмите кнопку "Забрать бонус"</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                      <p>Смотрите рекламу и получайте <strong className="text-foreground">50 жетонов за просмотр</strong> (до 5 раз в день)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                      <p>Побеждайте в играх и турнирах, чтобы <strong className="text-foreground">выигрывать жетоны соперников</strong></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="mb-12 animate-fade-in">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-5xl font-bold shadow-xl">
                      {playerStats.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-4xl font-bold mb-2">{playerStats.name}</h2>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <Badge className="text-base px-4 py-2 bg-primary">
                          <Icon name="Star" size={16} className="mr-1" />
                          Рейтинг: {playerStats.rating}
                        </Badge>
                        <Badge variant="outline" className="text-base px-4 py-2">
                          <Icon name="TrendingUp" size={16} className="mr-1" />
                          #{playerStats.rank || '—'} в мире
                        </Badge>
                        <Badge variant="secondary" className="text-base px-4 py-2">
                          <Icon name="Coins" size={16} className="mr-1" />
                          {tokens} жетонов
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="animate-scale-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground font-normal">Всего игр</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{playerStats.totalGames}</div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.05s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground font-normal">Победы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-500">{playerStats.wins}</div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground font-normal">Поражения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-500">{playerStats.losses}</div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.15s' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground font-normal">Винрейт</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-accent">{playerStats.winRate}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="BarChart3" size={24} className="text-primary" />
                    Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Flame" size={20} className="text-accent" />
                      <span className="font-medium">Лучшая серия побед</span>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">{playerStats.bestWinStreak} игр</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Zap" size={20} className="text-secondary" />
                      <span className="font-medium">Текущая серия</span>
                    </div>
                    <Badge variant="secondary">{playerStats.currentStreak} побед</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-green-500" />
                      <span className="font-medium">Жетонов выиграно</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      +{playerStats.tokensWon.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingDown" size={20} className="text-red-500" />
                      <span className="font-medium">Жетонов проиграно</span>
                    </div>
                    <Badge variant="outline" className="border-red-500 text-red-500">
                      -{playerStats.tokensLost.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Чистая прибыль</span>
                      <span className="font-bold text-2xl text-accent">
                        +{(playerStats.tokensWon - playerStats.tokensLost).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Trophy" size={24} className="text-accent" />
                    Достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={achievement.id}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          achievement.unlocked 
                            ? 'bg-accent/10 border-accent/30' 
                            : 'bg-muted/30 border-muted opacity-70'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            achievement.unlocked ? 'bg-accent text-accent-foreground' : 'bg-muted'
                          }`}>
                            <Icon name={achievement.icon as any} size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold mb-1 flex items-center justify-between">
                              <span>{achievement.title}</span>
                              {achievement.unlocked && (
                                <Icon name="Check" size={18} className="text-accent" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                            {!achievement.unlocked && (
                              <div>
                                <Progress value={achievement.progress} className="h-1.5" />
                                <div className="text-xs text-muted-foreground mt-1">{achievement.progress}%</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="History" size={24} className="text-primary" />
                  Последние игры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Соперник</th>
                        <th className="px-4 py-3 text-left font-semibold">Рейтинг</th>
                        <th className="px-4 py-3 text-left font-semibold">Результат</th>
                        <th className="px-4 py-3 text-left font-semibold">Ставка</th>
                        <th className="px-4 py-3 text-left font-semibold">Время</th>
                        <th className="px-4 py-3 text-left font-semibold">Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGames.map((game, index) => (
                        <tr 
                          key={game.id}
                          className="border-t hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium">{game.opponent}</td>
                          <td className="px-4 py-4">
                            <Badge variant="secondary" className="font-mono">
                              {game.opponentRating}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            {game.result === 'win' ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                <Icon name="Trophy" size={14} className="mr-1" />
                                Победа
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500 hover:bg-red-600">
                                <Icon name="X" size={14} className="mr-1" />
                                Поражение
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline">
                              <Icon name="Coins" size={14} className="mr-1" />
                              {game.bet}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{game.time}</td>
                          <td className="px-4 py-4 text-muted-foreground">{game.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <footer className="bg-foreground/5 py-8 px-4 mt-16">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>© 2025 Dice Chess. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;