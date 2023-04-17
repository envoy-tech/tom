import pathlib


def write_mps_file(content: str, filename: str):

    path_to_mps_folder = pathlib.Path("../../../mps_files")
    file_path = path_to_mps_folder / filename
    with open(file_path, "xt") as mps:
        mps.write(content)
