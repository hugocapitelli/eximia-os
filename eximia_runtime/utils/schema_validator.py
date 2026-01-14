"""JSON Schema validation for agent inputs and outputs"""

import json
from pathlib import Path
from typing import Any

import structlog

try:
    from jsonschema import validate, ValidationError, Draft7Validator
    HAS_JSONSCHEMA = True
except ImportError:
    HAS_JSONSCHEMA = False
    ValidationError = Exception


logger = structlog.get_logger()


class SchemaValidator:
    """
    Validates agent inputs and outputs against JSON schemas.
    
    Each agent can define:
    - input_schema.json: Expected input format
    - output_schema.json: Expected output format
    """

    def __init__(self):
        self._schema_cache: dict[str, dict] = {}

    def load_schema(self, agent_path: Path, schema_type: str) -> dict | None:
        """
        Load a schema from agent directory.
        
        Args:
            agent_path: Path to agent directory
            schema_type: 'input' or 'output'
            
        Returns:
            Schema dict or None if not found
        """
        cache_key = f"{agent_path}:{schema_type}"
        
        if cache_key in self._schema_cache:
            return self._schema_cache[cache_key]

        filename = f"{schema_type}_schema.json"
        candidates = [
            agent_path / filename,
            agent_path / "03_prompt" / filename,
            agent_path / "03_prompt" / "schemas" / filename,
        ]

        for candidate in candidates:
            if candidate.exists():
                try:
                    with open(candidate, encoding="utf-8") as f:
                        schema = json.load(f)
                        self._schema_cache[cache_key] = schema
                        return schema
                except json.JSONDecodeError as e:
                    logger.warning("invalid_schema_file", path=str(candidate), error=str(e))

        return None

    def validate_input(
        self,
        agent_path: Path,
        input_data: dict[str, Any],
    ) -> tuple[bool, list[str]]:
        """
        Validate input against agent's input schema.
        
        Returns:
            Tuple of (is_valid, list of error messages)
        """
        if not HAS_JSONSCHEMA:
            logger.debug("jsonschema_not_installed")
            return True, []

        schema = self.load_schema(agent_path, "input")
        if not schema:
            return True, []  # No schema = no validation

        return self._validate(input_data, schema)

    def validate_output(
        self,
        agent_path: Path,
        output_data: dict[str, Any] | str,
    ) -> tuple[bool, list[str]]:
        """
        Validate output against agent's output schema.
        
        Returns:
            Tuple of (is_valid, list of error messages)
        """
        if not HAS_JSONSCHEMA:
            return True, []

        schema = self.load_schema(agent_path, "output")
        if not schema:
            return True, []

        # Try to parse string output as JSON
        if isinstance(output_data, str):
            try:
                output_data = json.loads(output_data)
            except json.JSONDecodeError:
                # Output is plain text, not JSON - skip validation
                return True, []

        return self._validate(output_data, schema)

    def _validate(
        self,
        data: dict[str, Any],
        schema: dict,
    ) -> tuple[bool, list[str]]:
        """Run JSON Schema validation"""
        try:
            validate(instance=data, schema=schema)
            return True, []
        except ValidationError as e:
            errors = [str(e.message)]
            
            # Get all validation errors
            validator = Draft7Validator(schema)
            for error in validator.iter_errors(data):
                if str(error.message) not in errors:
                    errors.append(str(error.message))
            
            logger.warning("schema_validation_failed", errors=errors[:5])
            return False, errors

    def get_schema_info(self, agent_path: Path) -> dict[str, Any]:
        """Get info about available schemas for an agent"""
        input_schema = self.load_schema(agent_path, "input")
        output_schema = self.load_schema(agent_path, "output")

        return {
            "has_input_schema": input_schema is not None,
            "has_output_schema": output_schema is not None,
            "input_properties": list(input_schema.get("properties", {}).keys()) if input_schema else [],
            "input_required": input_schema.get("required", []) if input_schema else [],
        }


# Singleton instance
schema_validator = SchemaValidator()
