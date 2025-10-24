import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
type Color = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: Color;
}

interface Position {
  row: number;
  col: number;
}

const PIECE_SYMBOLS = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

const DICE_PIECE_MAP: PieceType[] = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];

const playSound = (type: 'move' | 'capture' | 'check' | 'gameover') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'move':
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
    case 'capture':
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case 'check':
      oscillator.frequency.value = 500;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
    case 'gameover':
      oscillator.frequency.value = 150;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
  }
};

const createInitialBoard = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRow[i], color: 'black' };
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
    board[7][i] = { type: backRow[i], color: 'white' };
  }
  
  return board;
};

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bet = parseInt(searchParams.get('bet') || '0');
  const timeControl = searchParams.get('time') || '5+3';
  
  const [board, setBoard] = useState<(Piece | null)[][]>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentTurn, setCurrentTurn] = useState<Color>('white');
  const [diceRoll, setDiceRoll] = useState<PieceType | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate' | 'draw'>('playing');
  const [winner, setWinner] = useState<Color | null>(null);

  useEffect(() => {
    if (gameStatus === 'playing' && timeControl !== 'Без ограничений') {
      const interval = setInterval(() => {
        if (currentTurn === 'white') {
          setWhiteTime(prev => Math.max(0, prev - 1));
        } else {
          setBlackTime(prev => Math.max(0, prev - 1));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTurn, gameStatus, timeControl]);

  useEffect(() => {
    if (timeControl !== 'Без ограничений') {
      if (whiteTime === 0) {
        playSound('gameover');
        setGameStatus('checkmate');
        setWinner('black');
      } else if (blackTime === 0) {
        playSound('gameover');
        setGameStatus('checkmate');
        setWinner('white');
      }
    }
  }, [whiteTime, blackTime, timeControl]);

  useEffect(() => {
    if (currentTurn === 'black' && !diceRoll && gameStatus === 'playing') {
      setTimeout(() => rollDice(), 1000);
    }
  }, [currentTurn, diceRoll, gameStatus]);

  useEffect(() => {
    if (currentTurn === 'black' && diceRoll && gameStatus === 'playing') {
      setTimeout(() => makeBotMove(), 1500);
    }
  }, [currentTurn, diceRoll, gameStatus]);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = DICE_PIECE_MAP[Math.floor(Math.random() * 6)];
      setDiceRoll(roll);
      setIsRolling(false);
    }, 500);
  };

  const isValidMove = (from: Position, to: Position, piece: Piece): boolean => {
    const dx = Math.abs(to.col - from.col);
    const dy = Math.abs(to.row - from.row);
    const targetPiece = board[to.row][to.col];

    if (targetPiece && targetPiece.color === piece.color) return false;

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        if (to.col === from.col && !targetPiece) {
          if (to.row === from.row + direction) return true;
          if (from.row === startRow && to.row === from.row + 2 * direction) {
            const middleRow = from.row + direction;
            if (!board[middleRow][from.col]) return true;
          }
        }
        
        if (dx === 1 && to.row === from.row + direction && targetPiece) {
          return true;
        }
        return false;

      case 'knight':
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

      case 'bishop':
        if (dx !== dy) return false;
        return isPathClear(from, to);

      case 'rook':
        if (dx !== 0 && dy !== 0) return false;
        return isPathClear(from, to);

      case 'queen':
        if (dx !== dy && dx !== 0 && dy !== 0) return false;
        return isPathClear(from, to);

      case 'king':
        return dx <= 1 && dy <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (from: Position, to: Position): boolean => {
    const dx = Math.sign(to.col - from.col);
    const dy = Math.sign(to.row - from.row);
    let x = from.col + dx;
    let y = from.row + dy;

    while (x !== to.col || y !== to.row) {
      if (board[y][x]) return false;
      x += dx;
      y += dy;
    }
    return true;
  };

  const findKing = (color: Color): Position | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isSquareUnderAttack = (pos: Position, byColor: Color): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === byColor) {
          if (isValidMove({ row, col }, pos, piece)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const makeMove = (from: Position, to: Position) => {
    const piece = board[from.row][from.col];
    if (!piece) return;

    const targetPiece = board[to.row][to.col];
    const newBoard = board.map(row => [...row]);
    
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    if (targetPiece) {
      playSound('capture');
      setCapturedPieces(prev => ({
        ...prev,
        [piece.color]: [...prev[piece.color], targetPiece]
      }));
      
      if (targetPiece.type === 'king') {
        setBoard(newBoard);
        playSound('gameover');
        setGameStatus('checkmate');
        setWinner(piece.color);
        return;
      }
    } else {
      playSound('move');
    }

    setBoard(newBoard);
    
    const move = `${PIECE_SYMBOLS[piece.color][piece.type]} ${String.fromCharCode(97 + from.col)}${8 - from.row} → ${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    setMoveHistory(prev => [...prev, move]);

    const enemyKingPos = findKing(currentTurn === 'white' ? 'black' : 'white');
    if (enemyKingPos && isSquareUnderAttack(enemyKingPos, piece.color)) {
      playSound('check');
      if (!hasValidMoves(currentTurn === 'white' ? 'black' : 'white')) {
        playSound('gameover');
        setGameStatus('checkmate');
        setWinner(piece.color);
      }
    }

    setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
    setDiceRoll(null);
    setSelectedSquare(null);
  };

  const hasValidMoves = (color: Color): boolean => {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove({ row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  const makeBotMove = () => {
    const validMoves: { from: Position, to: Position, score: number }[] = [];

    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && piece.color === 'black' && piece.type === diceRoll) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove({ row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece)) {
                const target = board[toRow][toCol];
                const score = target ? getPieceValue(target.type) : 0;
                validMoves.push({ 
                  from: { row: fromRow, col: fromCol }, 
                  to: { row: toRow, col: toCol },
                  score 
                });
              }
            }
          }
        }
      }
    }

    if (validMoves.length > 0) {
      validMoves.sort((a, b) => b.score - a.score);
      const bestMoves = validMoves.filter(m => m.score === validMoves[0].score);
      const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      makeMove(move.from, move.to);
    } else {
      setCurrentTurn('white');
      setDiceRoll(null);
    }
  };

  const getPieceValue = (type: PieceType): number => {
    const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };
    return values[type];
  };

  const handleSquareClick = (row: number, col: number) => {
    if (currentTurn !== 'white' || gameStatus !== 'playing') return;

    if (!diceRoll) return;

    const piece = board[row][col];

    if (selectedSquare) {
      if (row === selectedSquare.row && col === selectedSquare.col) {
        setSelectedSquare(null);
      } else if (isValidMove(selectedSquare, { row, col }, board[selectedSquare.row][selectedSquare.col]!)) {
        makeMove(selectedSquare, { row, col });
      } else if (piece && piece.color === 'white' && piece.type === diceRoll) {
        setSelectedSquare({ row, col });
      }
    } else if (piece && piece.color === 'white' && piece.type === diceRoll) {
      setSelectedSquare({ row, col });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResign = () => {
    playSound('gameover');
    setGameStatus('checkmate');
    setWinner('black');
  };

  const saveGameResult = (winner: Color) => {
    const currentTokens = parseInt(localStorage.getItem('tokens') || '350');
    if (winner === 'white') {
      localStorage.setItem('tokens', String(currentTokens + bet * 2));
    } else {
      localStorage.setItem('tokens', String(currentTokens - bet));
    }
  };

  useEffect(() => {
    if (gameStatus === 'checkmate' && winner) {
      saveGameResult(winner);
    }
  }, [gameStatus, winner]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Выйти
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>🎲</span>
              Dice Chess
              <span>♟️</span>
            </h1>
            <p className="text-muted-foreground">{bet > 0 ? `Ставка: ${bet} жетонов` : 'Тренировка'}</p>
          </div>
          <Button variant="destructive" onClick={handleResign} disabled={gameStatus !== 'playing'}>
            <Icon name="Flag" size={20} className="mr-2" />
            Сдаться
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px_300px] gap-6">
          <div className="lg:col-start-2">
            <div className="mb-4 p-4 bg-card rounded-lg border-2 border-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="font-semibold">Бот</div>
                  <div className="text-sm text-muted-foreground">Чёрные</div>
                </div>
              </div>
              {timeControl !== 'Без ограничений' && (
                <div className={`text-2xl font-bold ${currentTurn === 'black' ? 'text-primary' : ''}`}>
                  {formatTime(blackTime)}
                </div>
              )}
            </div>

            <Card className="p-4 bg-card">
              <div className="grid grid-cols-8 gap-0 w-full aspect-square">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0;
                    const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                    const canMove = selectedSquare && piece === null && 
                      isValidMove(selectedSquare, { row: rowIndex, col: colIndex }, board[selectedSquare.row][selectedSquare.col]!);
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          relative flex items-center justify-center text-4xl cursor-pointer transition-all
                          ${isLight ? 'bg-muted/60' : 'bg-primary/40'}
                          ${isSelected ? 'ring-4 ring-secondary' : ''}
                          ${canMove ? 'ring-2 ring-accent' : ''}
                          hover:brightness-110
                        `}
                      >
                        {piece && PIECE_SYMBOLS[piece.color][piece.type]}
                        {canMove && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-accent/50"></div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            <div className="mt-4 p-4 bg-card rounded-lg border-2 border-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <div className="font-semibold">Вы</div>
                  <div className="text-sm text-muted-foreground">Белые</div>
                </div>
              </div>
              {timeControl !== 'Без ограничений' && (
                <div className={`text-2xl font-bold ${currentTurn === 'white' ? 'text-primary' : ''}`}>
                  {formatTime(whiteTime)}
                </div>
              )}
            </div>

            <div className="mt-4 p-6 bg-card rounded-lg text-center">
              {gameStatus === 'checkmate' && (
                <div className="space-y-4">
                  <div className="text-4xl mb-2">{winner === 'white' ? '🎉' : '😔'}</div>
                  <h2 className="text-3xl font-bold">
                    {winner === 'white' ? 'Победа!' : 'Поражение'}
                  </h2>
                  {bet > 0 && (
                    <p className="text-muted-foreground">
                      {winner === 'white' ? `Вы выиграли ${bet * 2} жетонов!` : `Вы потеряли ${bet} жетонов`}
                    </p>
                  )}
                  <Button onClick={() => navigate('/')} size="lg" className="w-full">
                    <Icon name="Home" size={20} className="mr-2" />
                    На главную
                  </Button>
                </div>
              )}
              
              {gameStatus === 'playing' && (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    Ход: {currentTurn === 'white' ? 'Белые (Вы)' : 'Чёрные (Бот)'}
                  </div>
                  
                  {!diceRoll && !isRolling && currentTurn === 'white' && (
                    <Button onClick={rollDice} size="lg" className="w-full">
                      <Icon name="Dices" size={24} className="mr-2" />
                      Бросить кубик
                    </Button>
                  )}
                  
                  {isRolling && (
                    <div className="text-6xl animate-bounce">🎲</div>
                  )}
                  
                  {diceRoll && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Выпало:</div>
                      <div className="text-6xl">
                        {PIECE_SYMBOLS[currentTurn][diceRoll]}
                      </div>
                      <div className="text-lg font-semibold capitalize">{diceRoll}</div>
                      {currentTurn === 'white' && (
                        <p className="text-sm text-muted-foreground">Выберите фигуру на доске</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Trophy" size={20} />
                Захваченные фигуры
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Вы захватили:</div>
                  <div className="flex flex-wrap gap-1 min-h-[32px]">
                    {capturedPieces.white.map((piece, i) => (
                      <span key={i} className="text-2xl">{PIECE_SYMBOLS[piece.color][piece.type]}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Бот захватил:</div>
                  <div className="flex flex-wrap gap-1 min-h-[32px]">
                    {capturedPieces.black.map((piece, i) => (
                      <span key={i} className="text-2xl">{PIECE_SYMBOLS[piece.color][piece.type]}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="History" size={20} />
                История ходов
              </h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ходов пока нет</p>
                ) : (
                  moveHistory.map((move, i) => (
                    <div key={i} className="text-sm p-2 bg-muted/50 rounded">
                      <span className="font-mono text-muted-foreground mr-2">{i + 1}.</span>
                      {move}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}