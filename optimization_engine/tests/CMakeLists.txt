set(TEST_OPTIMIZATION test_optimization)

add_executable(
  ${TEST_OPTIMIZATION}
  test_optimize.cpp
)

CONFIGURE_FILE(
  ${CMAKE_CURRENT_SOURCE_DIR}/small_trip_circular.mps
  ${CMAKE_CURRENT_BINARY_DIR} COPYONLY
)

CONFIGURE_FILE(
  ${CMAKE_CURRENT_SOURCE_DIR}/small_trip_linear.mps
  ${CMAKE_CURRENT_BINARY_DIR} COPYONLY
)

find_package(Catch2 REQUIRED)

target_link_libraries(
  ${TEST_OPTIMIZATION}
  PRIVATE ${OPTIMIZATION_LIBRARY}
  Catch2::Catch2WithMain
)

include(Catch)

catch_discover_tests(${TEST_OPTIMIZATION})

install(TARGETS ${TEST_OPTIMIZATION} DESTINATION bin)
