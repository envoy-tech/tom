cmake_minimum_required(VERSION 3.22.2)
project(OptimizationEngine
  VERSION
    0.1
  DESCRIPTION
    "Travel Optimization Model (TOM) Optimization Engine Service"
  LANGUAGES
    CXX
)

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

include(FetchContent)
FetchContent_Declare(
  or-tools
  GIT_REPOSITORY https://github.com/google/or-tools.git
  GIT_TAG        v9.6
)

FetchContent_MakeAvailable(or-tools)

set(OPTIMIZATION_LIBRARY tom-optimization)
add_library(
  ${OPTIMIZATION_LIBRARY}
  src/tom-optimization/utils.cpp
  src/tom-optimization/optimize.cpp
)

target_include_directories(${OPTIMIZATION_LIBRARY} PUBLIC include)
target_link_libraries(${OPTIMIZATION_LIBRARY} ortools::ortools)

add_subdirectory(tests)
