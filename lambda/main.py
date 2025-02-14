# lambda/main.py

contacts = []

def lambda_handler(event, context):
    http_method = event.get('httpMethod')
    path = event.get('path')
    
    if http_method == 'GET' and path == '/contacts':
        return {
            'statusCode': 200,
            'body': json.dumps(contacts)
        }
    
    elif http_method == 'POST' and path == '/contacts':
        contact = json.loads(event['body'])
        contacts.append(contact)
        return {
            'statusCode': 201,
            'body': json.dumps(contact)
        }
    
    elif http_method == 'PUT' and path.startswith('/contacts/'):
        contact_id = int(path.split('/')[-1])
        updated_contact = json.loads(event['body'])
        
        if 0 <= contact_id < len(contacts):
            contacts[contact_id] = updated_contact
            return {
                'statusCode': 200,
                'body': json.dumps(updated_contact)
            }
        else:
            return {
                'statusCode': 404,
                'body': 'Contact not found'
            }
    
    elif http_method == 'DELETE' and path.startswith('/contacts/'):
        contact_id = int(path.split('/')[-1])
        
        if 0 <= contact_id < len(contacts):
            deleted_contact = contacts.pop(contact_id)
            return {
                'statusCode': 200,
                'body': json.dumps(deleted_contact)
            }
        else:
            return {
                'statusCode': 404,
                'body': 'Contact not found'
            }
    
    return {
        'statusCode': 400,
        'body': 'Bad Request'
    }