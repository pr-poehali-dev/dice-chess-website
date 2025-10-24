import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [tokens, setTokens] = useState(350);
  const [selectedBet, setSelectedBet] = useState(50);
  const [selectedTime, setSelectedTime] = useState("3+0");
  const [adsWatched, setAdsWatched] = useState(2);
  const [dailyClaimedToday, setDailyClaimedToday] = useState(false);

  const tournaments = [
    {
      id: 1,
      title: "Чемпионат Новичков",
      description: "Присоединяйтесь к нашему турниру для начинающих игроков и проверьте свои навыки в Dice Chess",
      date: "28 Октября 2025",
      prize: "5000 ₽",
      participants: 24,
      maxParticipants: 32,
      status: "Открыта регистрация"
    },
    {
      id: 2,
      title: "Мастерская Битва",
      description: "Турнир для опытных игроков с высокими ставками и престижными наградами",
      date: "5 Ноября 2025",
      prize: "25000 ₽",
      participants: 15,
      maxParticipants: 16,
      status: "Осталось мест"
    },
    {
      id: 3,
      title: "Блиц-Челлендж",
      description: "Быстрая игра, молниеносные решения. Докажите, что вы лучший в скоростной версии",
      date: "12 Ноября 2025",
      prize: "10000 ₽",
      participants: 8,
      maxParticipants: 64,
      status: "Открыта регистрация"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Александр Громов", rating: 2450, wins: 127, achievements: 15, trend: "up" },
    { rank: 2, name: "Мария Соколова", rating: 2398, wins: 115, achievements: 12, trend: "up" },
    { rank: 3, name: "Дмитрий Волков", rating: 2365, wins: 109, achievements: 11, trend: "same" },
    { rank: 4, name: "Елена Петрова", rating: 2312, wins: 98, achievements: 10, trend: "down" },
    { rank: 5, name: "Иван Кузнецов", rating: 2287, wins: 92, achievements: 9, trend: "up" },
    { rank: 6, name: "Ольга Морозова", rating: 2245, wins: 86, achievements: 8, trend: "up" },
    { rank: 7, name: "Сергей Новиков", rating: 2198, wins: 79, achievements: 7, trend: "same" },
    { rank: 8, name: "Анна Федорова", rating: 2156, wins: 73, achievements: 6, trend: "down" }
  ];

  const lobbyGames = [
    { id: 1, player: "Иван К.", rating: 1856, bet: 100, time: "5+3", status: "Ожидает" },
    { id: 2, player: "Мария С.", rating: 2145, bet: 200, time: "3+0", status: "Ожидает" },
    { id: 3, player: "Петр Д.", rating: 1678, bet: 50, time: "10+5", status: "Ожидает" },
    { id: 4, player: "Анна В.", rating: 1923, bet: 150, time: "5+0", status: "Ожидает" },
    { id: 5, player: "Сергей Н.", rating: 2234, bet: 300, time: "3+2", status: "Ожидает" },
  ];

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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Жетоны:</span>
                      <Badge className="text-2xl px-4 py-2 bg-accent text-accent-foreground">
                        {selectedBet}
                      </Badge>
                    </div>
                    <Slider
                      value={[selectedBet]}
                      onValueChange={(value) => setSelectedBet(value[0])}
                      min={10}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10</span>
                      <span>500</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[50, 100, 200, 300, 400, 500].map((bet) => (
                      <Button
                        key={bet}
                        variant={selectedBet === bet ? "default" : "outline"}
                        onClick={() => setSelectedBet(bet)}
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
