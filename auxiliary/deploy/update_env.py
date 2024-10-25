import json
import argparse
from typing import Union


parser = argparse.ArgumentParser(
    prog = "UpdateEnvironment",
    description = "Parse terraform output and update .env file"
)

parser.add_argument("path", type=str)
parser.add_argument("json_output", type=str)


if __name__ == "__main__":

    args = parser.parse_args()
    tf_output: dict[str, dict[str, Union[str, bool]]] = json.loads(args.json_output)

    # Get current .env state
    current_env = {}
    with open(args.path, "r") as env:
        for entry in env:
            var, val = entry.split("=")
            current_env[var] = val

    # Parse Terraform outputs
    updates = {var: f"{value_dict['value']}\n" for var, value_dict in tf_output.items()}

    # Join current .env state with Terraform updates
    current_env |= updates

    # Write new .env state
    with open(args.path, "w") as env:
        for var, val in current_env.items():
            env.write(f"{var}={val}")
