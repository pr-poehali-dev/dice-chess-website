'''
Business: Create YooKassa payment and handle payment confirmation webhook
Args: event with httpMethod, body containing amount and tokens
Returns: Payment creation response or webhook confirmation
'''

import json
import os
import uuid
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'create_payment':
            return create_payment(body_data, context)
        elif action == 'webhook':
            return handle_webhook(body_data, context)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid action'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }


def create_payment(data: Dict[str, Any], context: Any) -> Dict[str, Any]:
    import requests
    from requests.auth import HTTPBasicAuth
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Payment system not configured'})
        }
    
    user_id = data.get('user_id')
    amount = data.get('amount')
    tokens = data.get('tokens')
    
    if not all([user_id, amount, tokens]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    payment_id = str(uuid.uuid4())
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO t_p26016213_dice_chess_website.purchases (player_id, amount, tokens, payment_id, status) VALUES (%s, %s, %s, %s, 'pending')",
        (user_id, amount, tokens, payment_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    yookassa_payload = {
        'amount': {
            'value': f'{amount}.00',
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': f'https://{event.get("headers", {}).get("host", "localhost")}/shop?payment=success'
        },
        'capture': True,
        'description': f'Пополнение баланса: {tokens} жетонов',
        'metadata': {
            'payment_id': payment_id,
            'user_id': user_id,
            'tokens': tokens
        }
    }
    
    response = requests.post(
        'https://api.yookassa.ru/v3/payments',
        json=yookassa_payload,
        auth=HTTPBasicAuth(shop_id, secret_key),
        headers={
            'Idempotence-Key': payment_id,
            'Content-Type': 'application/json'
        }
    )
    
    if response.status_code in [200, 201]:
        payment_data = response.json()
        confirmation_url = payment_data.get('confirmation', {}).get('confirmation_url')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'payment_url': confirmation_url,
                'payment_id': payment_id
            })
        }
    else:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Payment creation failed', 'details': response.text})
        }


def handle_webhook(data: Dict[str, Any], context: Any) -> Dict[str, Any]:
    event_type = data.get('event')
    
    if event_type != 'payment.succeeded':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'status': 'ignored'})
        }
    
    payment_object = data.get('object', {})
    metadata = payment_object.get('metadata', {})
    payment_id = metadata.get('payment_id')
    user_id = metadata.get('user_id')
    tokens = int(metadata.get('tokens', 0))
    
    if not all([payment_id, user_id, tokens]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid webhook data'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute(
        "UPDATE t_p26016213_dice_chess_website.purchases SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE payment_id = %s AND status = 'pending'",
        (payment_id,)
    )
    
    if cursor.rowcount > 0:
        cursor.execute(
            "UPDATE t_p26016213_dice_chess_website.players SET tokens = tokens + %s WHERE id = %s",
            (tokens, user_id)
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'status': 'success'})
    }
