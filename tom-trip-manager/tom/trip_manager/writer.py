import os
from pathlib import Path

MPS_PATH = Path(Path(os.path.dirname(__file__)) / "../../../mps_files").resolve()


def write_mps_file(content: str, filename: str):

    file_path = MPS_PATH / filename
    with open(file_path, "w") as mps:
        mps.write(content)
