import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление профилем игрока (получение данных, изменение никнейма)
    Args: event - dict с httpMethod, headers (X-Auth-Token), body (username для update)
    Returns: HTTP response с данными профиля или статусом обновления
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется аутентификация'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            """SELECT player_id FROM sessions 
               WHERE token = %s AND expires_at > CURRENT_TIMESTAMP""",
            (token,)
        )
        session = cur.fetchone()
        
        if not session:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный или истекший токен'})
            }
        
        player_id = session['player_id']
        
        if method == 'GET':
            cur.execute(
                """SELECT id, username, email, rating, total_games, wins, losses, draws,
                          tokens, best_win_streak, current_streak, tokens_won, tokens_lost,
                          created_at, last_active
                   FROM players WHERE id = %s""",
                (player_id,)
            )
            player = cur.fetchone()
            
            if not player:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Игрок не найден'})
                }
            
            win_rate = round((player['wins'] / player['total_games'] * 100) if player['total_games'] > 0 else 0, 1)
            
            cur.execute(
                "SELECT COUNT(*) as rank FROM players WHERE rating > %s",
                (player['rating'],)
            )
            rank = cur.fetchone()['rank'] + 1
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': player['id'],
                    'username': player['username'],
                    'email': player['email'],
                    'rating': player['rating'],
                    'rank': rank,
                    'totalGames': player['total_games'],
                    'wins': player['wins'],
                    'losses': player['losses'],
                    'draws': player['draws'],
                    'winRate': win_rate,
                    'tokens': player['tokens'],
                    'bestWinStreak': player['best_win_streak'],
                    'currentStreak': player['current_streak'],
                    'tokensWon': player['tokens_won'],
                    'tokensLost': player['tokens_lost']
                })
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            new_username = body_data.get('username', '').strip()
            
            if not new_username:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Никнейм не может быть пустым'})
                }
            
            if len(new_username) < 3 or len(new_username) > 50:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Никнейм должен быть от 3 до 50 символов'})
                }
            
            cur.execute(
                "SELECT id FROM players WHERE username = %s AND id != %s",
                (new_username, player_id)
            )
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Этот никнейм уже занят'})
                }
            
            cur.execute(
                "UPDATE players SET username = %s WHERE id = %s",
                (new_username, player_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'username': new_username
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
