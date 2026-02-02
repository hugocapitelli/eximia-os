"""
Authentication utilities for Harven.AI
Provides secure password hashing with bcrypt.
"""

import bcrypt


def hash_password(password: str) -> str:
    """
    Generate a bcrypt hash of the password.

    Args:
        password: The plain text password to hash

    Returns:
        The bcrypt hash as a string
    """
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify if a password matches a bcrypt hash.

    Args:
        password: The plain text password to verify
        hashed: The bcrypt hash to check against

    Returns:
        True if the password matches, False otherwise
    """
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hashed.encode('utf-8')
        )
    except Exception:
        return False


def needs_rehash(hashed: str) -> bool:
    """
    Check if a password hash needs to be updated.
    Returns True if it's not a valid bcrypt hash (legacy plain text).

    Args:
        hashed: The stored password/hash to check

    Returns:
        True if the password needs to be rehashed
    """
    # Valid bcrypt hashes start with $2a$, $2b$, or $2y$
    if not hashed:
        return True
    return not (hashed.startswith('$2a$') or
                hashed.startswith('$2b$') or
                hashed.startswith('$2y$'))
