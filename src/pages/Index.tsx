import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const Index = () => {
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

  const gameModes = [
    {
      icon: "Zap",
      title: "Блиц",
      description: "Быстрые партии по 3 минуты на игрока",
      color: "bg-accent"
    },
    {
      icon: "Clock",
      title: "Классика",
      description: "Стандартное время 15+10 минут",
      color: "bg-primary"
    },
    {
      icon: "Trophy",
      title: "Турнир",
      description: "Соревновательный режим с призами",
      color: "bg-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
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
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Icon name="Play" className="mr-2" size={24} />
                  Играть сейчас
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 backdrop-blur-sm">
                  <Icon name="BookOpen" className="mr-2" size={24} />
                  Правила игры
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

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">Игровые режимы</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Выберите свой стиль игры</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {gameModes.map((mode, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in border-2 hover:border-primary"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 ${mode.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon name={mode.icon as any} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl">{mode.title}</CardTitle>
                  <CardDescription className="text-base">{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Начать игру
                    <Icon name="ArrowRight" className="ml-2" size={18} />
                  </Button>
                </CardContent>
              </Card>
            ))}
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
            <Button variant="outline" className="hidden md:flex">
              <Icon name="Calendar" className="mr-2" size={18} />
              Все турниры
            </Button>
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
            <Button variant="outline">
              <Icon name="TrendingUp" className="mr-2" size={18} />
              Полная таблица
            </Button>
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

      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Готовы начать свой путь к вершине?
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Присоединяйтесь к тысячам игроков по всему миру и докажите своё мастерство в Dice Chess
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <Icon name="UserPlus" className="mr-2" size={24} />
              Создать аккаунт
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-10 py-6 backdrop-blur-sm">
              <Icon name="PlayCircle" className="mr-2" size={24} />
              Смотреть турнир
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-foreground/5 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>© 2025 Dice Chess. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
