from setuptools import find_packages


from skbuild import setup

cmake_args = [
    "-DCMAKE_BUILD_TYPE=Release",
    "-DBUILD_DEPS=ON",
    "-DBUILD_COINOR=OFF",
    "-DBUILD_SAMPLES=OFF",
    "-DBUILD_EXAMPLES=OFF"
]

setup(
    name="tom-optimization-engine",
    version="0.0.1",
    description="Optimization engine service for TOM",
    dependencies=[
        "tom-common"
    ],
    packages=find_packages("src"),
    package_dir={"": "src"},
    cmake_args=cmake_args
)
