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

const playSound = (type: 'move' | 'capture' | 'gameover' | 'dice') => {
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
  const [diceRolls, setDiceRolls] = useState<PieceType[]>([]);
  const [movesLeft, setMovesLeft] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate'>('playing');
  const [winner, setWinner] = useState<Color | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);

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
    if (diceRolls.length === 0 && gameStatus === 'playing') {
      rollDice();
    }
  }, [currentTurn, gameStatus]);

  useEffect(() => {
    if (currentTurn === 'black' && diceRolls.length > 0 && movesLeft > 0 && gameStatus === 'playing') {
      setTimeout(() => makeBotMove(), 800);
    }
  }, [currentTurn, diceRolls, movesLeft, gameStatus]);

  const rollDice = () => {
    setIsRolling(true);
    playSound('dice');
    
    const rollInterval = setInterval(() => {
      playSound('dice');
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const rolls: PieceType[] = [];
      for (let i = 0; i < 3; i++) {
        rolls.push(DICE_PIECE_MAP[Math.floor(Math.random() * 6)]);
      }
      setDiceRolls(rolls);
      setMovesLeft(3);
      setIsRolling(false);
    }, 600);
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

  const getAllValidMoves = (color: Color, allowedPieces: PieceType[]): { from: Position, to: Position, pieceType: PieceType }[] => {
    const moves: { from: Position, to: Position, pieceType: PieceType }[] = [];
    
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && piece.color === color && allowedPieces.includes(piece.type)) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove({ row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece)) {
                moves.push({ 
                  from: { row: fromRow, col: fromCol }, 
                  to: { row: toRow, col: toCol },
                  pieceType: piece.type
                });
              }
            }
          }
        }
      }
    }
    
    return moves;
  };

  const calculateValidMovesForSquare = (pos: Position) => {
    const piece = board[pos.row][pos.col];
    if (!piece || piece.color !== currentTurn) return [];
    
    const moves: Position[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(pos, { row, col }, piece)) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
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

    const newMovesLeft = movesLeft - 1;
    setMovesLeft(newMovesLeft);
    setSelectedSquare(null);
    setValidMoves([]);

    if (newMovesLeft === 0) {
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      setDiceRolls([]);
    }
  };

  const evaluateMove = (from: Position, to: Position): number => {
    const piece = board[from.row][from.col];
    if (!piece) return 0;

    let score = 0;
    const target = board[to.row][to.col];
    
    if (target) {
      if (target.type === 'king') return 10000;
      score += getPieceValue(target.type) * 10;
    }

    const centerRow = Math.abs(to.row - 3.5);
    const centerCol = Math.abs(to.col - 3.5);
    score -= (centerRow + centerCol) * 0.3;

    if (difficulty === 'medium' || difficulty === 'hard') {
      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;
      
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const enemyPiece = newBoard[row][col];
          if (enemyPiece && enemyPiece.color !== piece.color) {
            if (isValidMove({ row, col }, to, enemyPiece)) {
              score -= getPieceValue(piece.type) * 3;
            }
          }
        }
      }
    }

    if (difficulty === 'hard') {
      score += Math.random() * 1.5;
    } else if (difficulty === 'easy') {
      score += Math.random() * 5;
    }

    return score;
  };

  const makeBotMove = () => {
    const allMoves = getAllValidMoves('black', diceRolls);
    
    if (allMoves.length === 0) {
      setCurrentTurn('white');
      setDiceRolls([]);
      setMovesLeft(3);
      return;
    }

    const scoredMoves = allMoves.map(move => ({
      ...move,
      score: evaluateMove(move.from, move.to)
    }));

    scoredMoves.sort((a, b) => b.score - a.score);
    
    let selectedMove;
    if (difficulty === 'easy') {
      const randomIndex = Math.floor(Math.random() * Math.min(allMoves.length, 8));
      selectedMove = scoredMoves[randomIndex];
    } else if (difficulty === 'medium') {
      const topMoves = scoredMoves.slice(0, 4);
      selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    } else {
      selectedMove = scoredMoves[0];
    }

    makeMove(selectedMove.from, selectedMove.to);
  };

  const getPieceValue = (type: PieceType): number => {
    const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };
    return values[type];
  };

  const handleSquareClick = (row: number, col: number) => {
    if (currentTurn !== 'white' || gameStatus !== 'playing') return;

    const piece = board[row][col];

    if (selectedSquare) {
      const isValidTarget = validMoves.some(move => move.row === row && move.col === col);
      
      if (isValidTarget) {
        makeMove(selectedSquare, { row, col });
      } else if (piece && piece.color === 'white' && diceRolls.includes(piece.type)) {
        setSelectedSquare({ row, col });
        setValidMoves(calculateValidMovesForSquare({ row, col }));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && piece.color === 'white' && diceRolls.includes(piece.type)) {
      setSelectedSquare({ row, col });
      setValidMoves(calculateValidMovesForSquare({ row, col }));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Выйти
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2 justify-center">
              <span>🎲</span>
              Dice Chess
              <span>♟️</span>
            </h1>
            <p className="text-slate-400">{bet > 0 ? `Ставка: ${bet} жетонов` : 'Тренировка'}</p>
          </div>
          <Button variant="destructive" onClick={handleResign} disabled={gameStatus !== 'playing'}>
            <Icon name="Flag" size={20} className="mr-2" />
            Сдаться
          </Button>
        </div>

        <div className="grid lg:grid-cols-[300px_auto_300px] gap-6 items-start max-w-[1400px] mx-auto">
          <div className="space-y-4">
            <Card className="p-4 bg-slate-800 border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Icon name="Dices" size={20} />
                Кубики ({movesLeft} {movesLeft === 1 ? 'ход' : 'хода'})
              </h3>
              {isRolling ? (
                <div className="flex justify-center gap-3 py-8">
                  <div className="text-5xl animate-bounce">🎲</div>
                  <div className="text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎲</div>
                  <div className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎲</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {diceRolls.map((pieceType, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-slate-700 border-2 border-slate-600"
                    >
                      <div className="text-4xl text-center mb-1">
                        {PIECE_SYMBOLS.white[pieceType]}
                      </div>
                      <div className="text-[10px] text-center capitalize font-semibold text-slate-300">
                        {pieceType === 'pawn' ? 'пешка' : pieceType === 'knight' ? 'конь' : pieceType === 'bishop' ? 'слон' : pieceType === 'rook' ? 'ладья' : pieceType === 'queen' ? 'ферзь' : 'король'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {currentTurn === 'white' && movesLeft > 0 && diceRolls.length > 0 && (
                <p className="text-xs text-center mt-3 text-slate-400">
                  Выберите фигуру из кубиков
                </p>
              )}
            </Card>

            <Card className="p-4 bg-slate-800 border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Icon name="Trophy" size={20} />
                Захвачено
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Вы:</div>
                  <div className="flex flex-wrap gap-1 min-h-[28px] bg-slate-900/50 p-2 rounded">
                    {capturedPieces.white.length === 0 ? (
                      <span className="text-xs text-slate-500">Нет</span>
                    ) : (
                      capturedPieces.white.map((piece, i) => (
                        <span key={i} className="text-xl">{PIECE_SYMBOLS[piece.color][piece.type]}</span>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Бот:</div>
                  <div className="flex flex-wrap gap-1 min-h-[28px] bg-slate-900/50 p-2 rounded">
                    {capturedPieces.black.length === 0 ? (
                      <span className="text-xs text-slate-500">Нет</span>
                    ) : (
                      capturedPieces.black.map((piece, i) => (
                        <span key={i} className="text-xl">{PIECE_SYMBOLS[piece.color][piece.type]}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-[600px] mb-4 p-3 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="font-semibold text-white">{getDifficultyLabel()}</div>
                  <div className="text-xs text-slate-400">Чёрные</div>
                </div>
              </div>
              {timeControl !== 'Без ограничений' && (
                <div className={`text-xl font-bold ${currentTurn === 'black' ? 'text-green-400' : 'text-white'}`}>
                  {formatTime(blackTime)}
                </div>
              )}
            </div>

            <div className="relative w-full max-w-[600px]">
              <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-slate-400 text-sm font-mono">
                {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                  <div key={num} className="h-[12.5%] flex items-center">{num}</div>
                ))}
              </div>
              
              <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-slate-400 text-sm font-mono">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                  <div key={letter} className="w-[12.5%] text-center">{letter}</div>
                ))}
              </div>

              <div className="bg-amber-900 p-4 rounded-lg shadow-2xl border-4 border-amber-950">
                <div className="grid grid-cols-8 gap-0 w-full aspect-square rounded-md overflow-hidden shadow-inner">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0;
                      const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                      const isValidMoveSquare = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
                      const canCapture = isValidMoveSquare && piece && piece.color !== 'white';
                      
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                          className={`
                            relative flex items-center justify-center cursor-pointer transition-all aspect-square
                            ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
                            ${isSelected ? 'ring-4 ring-blue-500 ring-inset brightness-110' : ''}
                            ${isValidMoveSquare && !canCapture ? 'after:absolute after:w-3 after:h-3 after:bg-green-400 after:rounded-full after:opacity-70 after:shadow-lg' : ''}
                            ${canCapture ? 'ring-4 ring-red-500 ring-inset brightness-110' : ''}
                            hover:brightness-105
                          `}
                          style={{ fontSize: 'clamp(24px, 5vw, 48px)' }}
                        >
                          {piece && (
                            <span className="filter drop-shadow-lg">
                              {PIECE_SYMBOLS[piece.color][piece.type]}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="w-full max-w-[600px] mt-4 p-3 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <div className="font-semibold text-white">Вы</div>
                  <div className="text-xs text-slate-400">Белые</div>
                </div>
              </div>
              {timeControl !== 'Без ограничений' && (
                <div className={`text-xl font-bold ${currentTurn === 'white' ? 'text-green-400' : 'text-white'}`}>
                  {formatTime(whiteTime)}
                </div>
              )}
            </div>

            {gameStatus === 'checkmate' && (
              <Card className="mt-4 w-full max-w-[600px] p-6 bg-slate-800 border-slate-700">
                <div className="space-y-4 text-center">
                  <div className="text-5xl mb-2">{winner === 'white' ? '🎉' : '😔'}</div>
                  <h2 className="text-3xl font-bold text-white">
                    {winner === 'white' ? 'Победа!' : 'Поражение'}
                  </h2>
                  {bet > 0 && (
                    <p className="text-slate-400">
                      {winner === 'white' ? `Вы выиграли ${bet * 2} жетонов!` : `Вы потеряли ${bet} жетонов`}
                    </p>
                  )}
                  <Button onClick={() => navigate('/')} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Icon name="Home" size={20} className="mr-2" />
                    На главную
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-slate-800 border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Icon name="Info" size={20} />
                Правила DiceChess
              </h3>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>• <strong>3 кубика</strong> — каждый ход бросаются 3 кубика с фигурами</p>
                <p>• <strong>3 хода</strong> — нужно сделать ровно 3 хода за свой ход</p>
                <p>• <strong>Только из кубиков</strong> — ходить можно только теми фигурами, что выпали</p>
                <p>• <strong>Цель</strong> — захватить короля противника</p>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800 border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Icon name="History" size={20} />
                История ({moveHistory.length})
              </h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                {moveHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Ходов пока нет</p>
                ) : (
                  moveHistory.slice(-15).reverse().map((move, i) => (
                    <div key={moveHistory.length - i} className="text-xs p-2 bg-slate-700/50 rounded hover:bg-slate-700 transition-colors">
                      <span className="font-mono text-slate-500 mr-2">{moveHistory.length - i}.</span>
                      <span className="text-slate-200">{move}</span>
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
