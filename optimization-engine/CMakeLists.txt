cmake_minimum_required(VERSION 3.22.2)
project(OptimizationEngine
  VERSION
    1.0
  DESCRIPTION
    "Optimization Engine Service"
  LANGUAGES
    CXX
)

set(CXX_FLAGS cxx_std_20)

enable_testing()

set(TOM_DIR "${CMAKE_SOURCE_DIR}/..")
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Extra modules defined in the cmake directory
list(PREPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_LIST_DIR}/cmake)

find_package(Python COMPONENTS Interpreter Development)

include(FetchContent)
include(pybind11)

FetchContent_Declare(
  or-tools
  GIT_REPOSITORY https://github.com/google/or-tools.git
  GIT_TAG        stable
)

FetchContent_MakeAvailable(or-tools)

set(OPTIMIZATION_LIBRARY optimization-engine)
add_library(
  ${OPTIMIZATION_LIBRARY}
  src/optimization-engine/utils.cpp
  src/optimization-engine/optimize.cpp
)

target_include_directories(
  ${OPTIMIZATION_LIBRARY}
  PUBLIC include
)

target_link_libraries(
  ${OPTIMIZATION_LIBRARY}
  PUBLIC ortools::ortools
  PUBLIC Python::Python
)

set(OE-PYTHON-MODULE optimization_engine)
pybind11_add_module(
  ${OE-PYTHON-MODULE} MODULE
  src/optimization-engine/optimize.cpp
)

target_link_libraries(${OE-PYTHON-MODULE} PRIVATE ${OPTIMIZATION_LIBRARY})

install(TARGETS ${OE-PYTHON-MODULE} DESTINATION src/optimization-engine)

add_subdirectory(tests)
