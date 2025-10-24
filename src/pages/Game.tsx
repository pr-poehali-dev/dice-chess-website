import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
type Color = 'white' | 'black';
type Difficulty = 'easy' | 'medium' | 'hard';

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

const playSound = (type: 'move' | 'capture' | 'check' | 'gameover' | 'dice') => {
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
    case 'dice':
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
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
  const difficulty = (searchParams.get('difficulty') || 'medium') as Difficulty;
  
  const [board, setBoard] = useState<(Piece | null)[][]>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentTurn, setCurrentTurn] = useState<Color>('white');
  const [diceOptions, setDiceOptions] = useState<PieceType[]>([]);
  const [selectedDice, setSelectedDice] = useState<PieceType | null>(null);
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
    if (currentTurn === 'black' && diceOptions.length === 0 && gameStatus === 'playing') {
      setTimeout(() => rollDice(), 1000);
    }
  }, [currentTurn, diceOptions, gameStatus]);

  useEffect(() => {
    if (currentTurn === 'black' && diceOptions.length > 0 && gameStatus === 'playing') {
      setTimeout(() => makeBotMove(), 1500);
    }
  }, [currentTurn, diceOptions, gameStatus]);

  const rollDice = () => {
    setIsRolling(true);
    playSound('dice');
    
    const rollInterval = setInterval(() => {
      playSound('dice');
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const options: PieceType[] = [];
      for (let i = 0; i < 3; i++) {
        options.push(DICE_PIECE_MAP[Math.floor(Math.random() * 6)]);
      }
      setDiceOptions(options);
      setIsRolling(false);
    }, 800);
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
    setDiceOptions([]);
    setSelectedDice(null);
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

  const evaluateMove = (from: Position, to: Position, depth: number): number => {
    const piece = board[from.row][from.col];
    if (!piece) return 0;

    let score = 0;
    const target = board[to.row][to.col];
    
    if (target) {
      score += getPieceValue(target.type) * 10;
    }

    const centerRow = Math.abs(to.row - 3.5);
    const centerCol = Math.abs(to.col - 3.5);
    score -= (centerRow + centerCol) * 0.5;

    if (difficulty === 'medium' || difficulty === 'hard') {
      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;
      
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const enemyPiece = newBoard[row][col];
          if (enemyPiece && enemyPiece.color !== piece.color) {
            if (isValidMove({ row, col }, to, enemyPiece)) {
              score -= getPieceValue(piece.type) * 5;
            }
          }
        }
      }
    }

    if (difficulty === 'hard') {
      score += Math.random() * 2;
    }

    return score;
  };

  const makeBotMove = () => {
    const validMoves: { from: Position, to: Position, pieceType: PieceType, score: number }[] = [];

    for (const diceOption of diceOptions) {
      for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
          const piece = board[fromRow][fromCol];
          if (piece && piece.color === 'black' && piece.type === diceOption) {
            for (let toRow = 0; toRow < 8; toRow++) {
              for (let toCol = 0; toCol < 8; toCol++) {
                if (isValidMove({ row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece)) {
                  const score = evaluateMove({ row: fromRow, col: fromCol }, { row: toRow, col: toCol }, 1);
                  validMoves.push({ 
                    from: { row: fromRow, col: fromCol }, 
                    to: { row: toRow, col: toCol },
                    pieceType: diceOption,
                    score 
                  });
                }
              }
            }
          }
        }
      }
    }

    if (validMoves.length > 0) {
      validMoves.sort((a, b) => b.score - a.score);
      
      let move;
      if (difficulty === 'easy') {
        const randomIndex = Math.floor(Math.random() * Math.min(validMoves.length, 5));
        move = validMoves[randomIndex];
      } else if (difficulty === 'medium') {
        const topMoves = validMoves.slice(0, 3);
        move = topMoves[Math.floor(Math.random() * topMoves.length)];
      } else {
        move = validMoves[0];
      }
      
      setSelectedDice(move.pieceType);
      setTimeout(() => {
        makeMove(move.from, move.to);
      }, 500);
    } else {
      setCurrentTurn('white');
      setDiceOptions([]);
    }
  };

  const getPieceValue = (type: PieceType): number => {
    const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };
    return values[type];
  };

  const handleDiceSelect = (pieceType: PieceType) => {
    if (currentTurn !== 'white' || gameStatus !== 'playing') return;
    setSelectedDice(pieceType);
    setSelectedSquare(null);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (currentTurn !== 'white' || gameStatus !== 'playing') return;

    if (!selectedDice) return;

    const piece = board[row][col];

    if (selectedSquare) {
      if (row === selectedSquare.row && col === selectedSquare.col) {
        setSelectedSquare(null);
      } else if (isValidMove(selectedSquare, { row, col }, board[selectedSquare.row][selectedSquare.col]!)) {
        makeMove(selectedSquare, { row, col });
      } else if (piece && piece.color === 'white' && piece.type === selectedDice) {
        setSelectedSquare({ row, col });
      }
    } else if (piece && piece.color === 'white' && piece.type === selectedDice) {
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

  const getDifficultyLabel = () => {
    switch(difficulty) {
      case 'easy': return 'Новичок';
      case 'medium': return 'Эксперт';
      case 'hard': return 'Мастер';
      default: return 'Бот';
    }
  };

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

        <div className="grid lg:grid-cols-[1fr_auto_300px] gap-6 items-start">
          <div className="lg:col-start-2 flex flex-col items-center">
            <div className="w-full max-w-[600px] mb-4 p-4 bg-card rounded-lg border-2 border-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="font-semibold">{getDifficultyLabel()}</div>
                  <div className="text-sm text-muted-foreground">Чёрные</div>
                </div>
              </div>
              {timeControl !== 'Без ограничений' && (
                <div className={`text-2xl font-bold ${currentTurn === 'black' ? 'text-primary' : ''}`}>
                  {formatTime(blackTime)}
                </div>
              )}
            </div>

            <Card className="p-4 bg-card w-full max-w-[600px]">
              <div className="grid grid-cols-8 gap-0 w-full aspect-square">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0;
                    const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                    const canMove = selectedSquare && piece === null && 
                      isValidMove(selectedSquare, { row: rowIndex, col: colIndex }, board[selectedSquare.row][selectedSquare.col]!);
                    const canCapture = selectedSquare && piece && piece.color !== 'white' &&
                      isValidMove(selectedSquare, { row: rowIndex, col: colIndex }, board[selectedSquare.row][selectedSquare.col]!);
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          relative flex items-center justify-center cursor-pointer transition-all aspect-square
                          ${isLight ? 'bg-muted/60' : 'bg-primary/40'}
                          ${isSelected ? 'ring-4 ring-secondary ring-inset' : ''}
                          ${canMove ? 'ring-2 ring-accent ring-inset' : ''}
                          ${canCapture ? 'ring-4 ring-red-500 ring-inset' : ''}
                          hover:brightness-110
                        `}
                        style={{ fontSize: 'clamp(24px, 5vw, 48px)' }}
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

            <div className="w-full max-w-[600px] mt-4 p-4 bg-card rounded-lg border-2 border-muted flex items-center justify-between">
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

            <div className="w-full max-w-[600px] mt-4 p-6 bg-card rounded-lg">
              {gameStatus === 'checkmate' && (
                <div className="space-y-4 text-center">
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
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground text-center mb-4">
                    Ход: {currentTurn === 'white' ? 'Белые (Вы)' : `Чёрные (${getDifficultyLabel()})`}
                  </div>
                  
                  {diceOptions.length === 0 && !isRolling && currentTurn === 'white' && (
                    <Button onClick={rollDice} size="lg" className="w-full">
                      <Icon name="Dices" size={24} className="mr-2" />
                      Бросить кубики
                    </Button>
                  )}
                  
                  {isRolling && (
                    <div className="flex justify-center gap-4">
                      <div className="text-6xl animate-bounce">🎲</div>
                      <div className="text-6xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎲</div>
                      <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎲</div>
                    </div>
                  )}
                  
                  {diceOptions.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground text-center">
                        {currentTurn === 'white' ? 'Выберите фигуру:' : 'Бот выбирает...'}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {diceOptions.map((pieceType, index) => (
                          <button
                            key={index}
                            onClick={() => handleDiceSelect(pieceType)}
                            disabled={currentTurn !== 'white'}
                            className={`
                              p-4 rounded-lg border-2 transition-all
                              ${selectedDice === pieceType 
                                ? 'bg-secondary border-secondary ring-4 ring-secondary/50' 
                                : 'bg-card border-muted hover:border-secondary'
                              }
                              ${currentTurn !== 'white' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            <div className="text-5xl text-center mb-2">
                              {PIECE_SYMBOLS.white[pieceType]}
                            </div>
                            <div className="text-xs text-center capitalize font-semibold">
                              {pieceType}
                            </div>
                          </button>
                        ))}
                      </div>
                      {selectedDice && currentTurn === 'white' && (
                        <p className="text-sm text-center text-muted-foreground">
                          Выберите фигуру "{selectedDice}" на доске
                        </p>
                      )}
                    </div>
                  )}
                </div>
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
