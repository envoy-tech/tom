set(TEST_OPTIMIZATION test_optimization)

add_executable(
  ${TEST_OPTIMIZATION}
  test_utils.cpp
  test_optimize.cpp
)

CONFIGURE_FILE(
  ${CMAKE_CURRENT_SOURCE_DIR}/test.mps
  ${CMAKE_CURRENT_BINARY_DIR} COPYONLY
)

CONFIGURE_FILE(
  ${CMAKE_CURRENT_SOURCE_DIR}/sample_MPSolutionResponse.json
  ${CMAKE_CURRENT_BINARY_DIR} COPYONLY
)

CONFIGURE_FILE(
  ${CMAKE_CURRENT_SOURCE_DIR}/test_large.mps
  ${CMAKE_CURRENT_BINARY_DIR} COPYONLY
)

CONFIGURE_FILE(
  ${CMAKE_CURRENT_SOURCE_DIR}/sample_large_MPSolutionResponse.json
  ${CMAKE_CURRENT_BINARY_DIR} COPYONLY
)

FetchContent_Declare(
  Catch2
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.0.1
)

FetchContent_MakeAvailable(Catch2)

target_link_libraries(
  ${TEST_OPTIMIZATION}
  PRIVATE ${OPTIMIZATION_LIBRARY}
  Catch2::Catch2WithMain
)

include(Catch)

catch_discover_tests(${TEST_OPTIMIZATION})

install(TARGETS ${TEST_OPTIMIZATION} DESTINATION bin)
