import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Аутентификация и регистрация игроков
    Args: event - dict с httpMethod, body (email, password, username для регистрации)
    Returns: HTTP response с токеном или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            email = body_data.get('email', '').strip().lower()
            password = body_data.get('password', '')
            username = body_data.get('username', '').strip()
            
            if not email or not password or not username:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email, password и username обязательны'})
                }
            
            if len(username) < 3 or len(username) > 50:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Никнейм должен быть от 3 до 50 символов'})
                }
            
            if len(password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'})
                }
            
            cur.execute("SELECT id FROM players WHERE email = %s", (email,))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email уже используется'})
                }
            
            cur.execute("SELECT id FROM players WHERE username = %s", (username,))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Никнейм уже занят'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(
                """INSERT INTO players (email, username, password_hash, tokens, rating, created_at, last_active)
                   VALUES (%s, %s, %s, 350, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                   RETURNING id""",
                (email, username, password_hash)
            )
            player_id = cur.fetchone()['id']
            
            cur.execute("SELECT id FROM achievements")
            achievements = cur.fetchall()
            for achievement in achievements:
                cur.execute(
                    "INSERT INTO player_achievements (player_id, achievement_id, progress) VALUES (%s, %s, 0)",
                    (player_id, achievement['id'])
                )
            
            token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(days=30)
            
            cur.execute(
                "INSERT INTO sessions (player_id, token, expires_at) VALUES (%s, %s, %s)",
                (player_id, token, expires_at)
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'playerId': player_id,
                    'username': username,
                    'email': email
                })
            }
        
        elif action == 'login':
            email = body_data.get('email', '').strip().lower()
            password = body_data.get('password', '')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и password обязательны'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(
                "SELECT id, username, email FROM players WHERE email = %s AND password_hash = %s",
                (email, password_hash)
            )
            player = cur.fetchone()
            
            if not player:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'})
                }
            
            token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(days=30)
            
            cur.execute(
                "INSERT INTO sessions (player_id, token, expires_at) VALUES (%s, %s, %s)",
                (player['id'], token, expires_at)
            )
            
            cur.execute(
                "UPDATE players SET last_active = CURRENT_TIMESTAMP WHERE id = %s",
                (player['id'],)
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'playerId': player['id'],
                    'username': player['username'],
                    'email': player['email']
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'})
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
