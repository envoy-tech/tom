from setuptools import find_packages

from skbuild import setup

setup(
    name="tom-optimization-engine",
    version="0.0.1",
    description="Optimization engine service for TOM",
    dependencies=[
        "tom-common"
    ],
    packages=find_packages("src"),
    package_dir={"": "src"}
)
