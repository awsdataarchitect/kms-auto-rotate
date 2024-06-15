import sys
from pip._internal import main

main(['install', '-I', '-q', 'boto3', '--target', '/tmp/', '--no-cache-dir', '--disable-pip-version-check'])
sys.path.insert(0,'/tmp/')

import boto3

def rotate_key(event, context):
    kms_client = boto3.client('kms')
    key_id = event.get('KMS_KEY_ID')

    if not key_id:
        raise ValueError("KMS_KEY_ID is not provided in the event payload")

    try:
        # Ensure KeyId is a string
        if isinstance(key_id, list):
            key_id = key_id[0]
        
        # Rotate the KMS key
        kms_client.rotate_key_on_demand(KeyId=key_id)
        print(f"KMS key {key_id} rotated successfully.")
        
        # Get the key rotation status
        rotation_list = kms_client.list_key_rotations(KeyId=key_id)
        print(f"Key rotation status for KMS key {key_id}: {rotation_list}")
        
    except Exception as e:
        print(f"Error rotating KMS key {key_id}: {e}")
        raise
