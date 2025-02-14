
import json
contacts = [
    {
        "Test":"Prueba"
    }
]

def lambda_handler(event, context):
    http_method = event.get('httpMethod')
    path = event.get('path')
    
    if http_method == 'GET' and path == '/contacts':
        return {
            'statusCode': 200,
            'body': json.dumps(contacts)
        }
    