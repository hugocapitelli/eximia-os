import os
import boto3
from botocore.exceptions import ClientError
from pathlib import Path
from eximia_runtime.core.config import settings

class CodexStorage:
    """
    Adapter for Object Storage (S3/Supabase).
    Handles Lazy Loading of files: Check Local -> Download if missing.
    """
    
    def __init__(self):
        self.bucket = settings.storage_bucket
        self.endpoint = settings.storage_endpoint
        self.enabled = bool(self.endpoint and settings.storage_access_key)
        
        if self.enabled:
            self.s3 = boto3.client(
                's3',
                endpoint_url=self.endpoint,
                aws_access_key_id=settings.storage_access_key,
                aws_secret_access_key=settings.storage_secret_key
            )
        else:
            self.s3 = None
            print("⚠️ Storage not configured. S3 features disabled.")

    def ensure_file(self, local_path: Path, remote_key: str) -> bool:
        """
        Ensures a file exists locally. If not, attempts to download from S3.
        Returns True if file exists (or was downloaded), False otherwise.
        """
        if local_path.exists():
            return True
        
        if not self.enabled:
            return False
            
        try:
            print(f"☁️ Downloading {remote_key} from Cloud Storge...")
            local_path.parent.mkdir(parents=True, exist_ok=True)
            self.s3.download_file(self.bucket, remote_key, str(local_path))
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == "404":
                print(f"❌ File not found in bucket: {remote_key}")
            else:
                print(f"❌ error downloading {remote_key}: {e}")
            return False

    def upload_file(self, local_path: Path, remote_key: str) -> bool:
        """
        Uploads a local file to S3.
        """
        if not self.enabled:
            return False
            
        try:
            print(f"☁️ Uploading {remote_key} to Cloud Storage...")
            self.s3.upload_file(str(local_path), self.bucket, remote_key)
            return True
        except Exception as e:
            print(f"❌ Error uploading {remote_key}: {e}")
            return False

    def delete_file(self, remote_key: str) -> bool:
        """
        Deletes a file from S3.
        """
        if not self.enabled:
            return False
            
        try:
            print(f"☁️ Deleting {remote_key} from Cloud Storage...")
            self.s3.delete_object(Bucket=self.bucket, Key=remote_key)
            return True
        except Exception as e:
            print(f"❌ Error deleting {remote_key}: {e}")
            return False

    def list_files(self, prefix: str = "") -> list[str]:
        """List files in the bucket"""
        if not self.enabled:
            return []
        
        try:
            response = self.s3.list_objects_v2(Bucket=self.bucket, Prefix=prefix)
            return [obj['Key'] for obj in response.get('Contents', [])]
        except Exception as e:
            print(f"❌ Error listing files: {e}")
            return []

# Singleton
storage = CodexStorage()
