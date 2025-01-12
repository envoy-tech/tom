const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    const profile1 = await prisma.profile.upsert({
        where: {id: 1},
        update: {},
        create: {
            email: "guillermo@envoytech.io",
            name: "Guillermo Wilder-Gutierrez",
            friends: [2, 3, 4, 5],
            profile_trip: {}
        }
    })

    const profile2 = await prisma.profile.upsert({
        where: {id: 2},
        update: {},
        create: {
            email: "nicole@adventurus.travel",
            name: "Nicole Wilder-Gutierrez",
            friends: [1, 3, 4],
            profile_trip: {}
        }
    })

    const profile3 = await prisma.profile.upsert({
        where: {id: 3},
        update: {},
        create: {
            email: "kyle@adventurus.travel",
            name: "Kyle Linkous",
            friends: [1, 2, 4],
            profile_trip: {}
        }
    })

    const profile4 = await prisma.profile.upsert({
        where: {id: 4},
        update: {},
        create: {
            email: "soula@somewhere.com",
            name: "Soula Kosti",
            friends: [1, 2, 3],
            profile_trip: {}
        }
    })

    const profile5 = await prisma.profile.upsert({
        where: {id: 5},
        update: {},
        create: {
            email: "jeffkkim612@gmail.com",
            name: "Jeff Kim",
            friends: [1],
            profile_trip: {}
        }
    })

    const trip = await prisma.trip.upsert({
        where: {id: 1},
        update: {},
        create: {
            name: "seed-trip",
            start_date_dttm: new Date("2025-10-31 10:00:00"),
            end_date_dttm: new Date("2025-11-30 20:00:00"),
            dates_approximate: false,
            start_location_index: 0,
            end_location_index: 0,
            itineraries_json_array: [{}],
            profile_trip: {},
            locations_json: [
                {
                    "idx": 0,
                    "name": "Location 0",
                    "address": "",
                    "notes": "",
                    "lat": 34.052235,
                    "lon": -118.243683
                },
                {
                    "idx": 1,
                    "name": "Location 1",
                    "address": "",
                    "notes": "",
                    "lat": 34.42083,
                    "lon": -119.698189
                },
                {
                    "idx": 2,
                    "name": "Location 2",
                    "address": "",
                    "notes": "",
                    "lat": 37.774929,
                    "lon": -122.419418
                },
                {
                    "idx": 3,
                    "name": "Location 3",
                    "address": "",
                    "notes": "",
                    "lat": 38.581573,
                    "lon": -121.4944
                },
                {
                    "idx": 4,
                    "name": "Location 4",
                    "address": "",
                    "notes": "",
                    "lat": 45.51223,
                    "lon": -122.658722
                },
                {
                    "idx": 5,
                    "name": "Location 5",
                    "address": "",
                    "notes": "",
                    "lat": 41.422649,
                    "lon": -122.386124
                },
                {
                    "idx": 6,
                    "name": "Location 6",
                    "address": "",
                    "notes": "",
                    "lat": 36.7394421,
                    "lon": -119.7848307
                },
                {
                    "idx": 7,
                    "name": "Location 7",
                    "address": "",
                    "notes": "",
                    "lat": 33.7721794,
                    "lon": -116.4952977
                },
                {
                    "idx": 8,
                    "name": "Location 8",
                    "address": "",
                    "notes": "",
                    "lat": 40.7127281,
                    "lon": -74.0060152
                }
            ]
        }
    })

    const profile_trip_1 = await prisma.profile_trip.upsert({
        where: {id: 1},
        update: {},
        create: {
            profile: {
                connect: {id: profile1.id}
            },
            trip: {
                connect: {id: trip.id}
            },
            is_trip_owner: true,
            is_ready_to_optimize: false,
            trip_preferences_json: {
                "location_ratings": [5, 10, 7.5, 2.5, 8.25, 1, 4.75, 9, 6.5],
                "desired_time_in_location": [24, 72, 36, 12, 72, 6, 24, 72, 48],
                "road_travel_threshold": 12,
                "earliest_acceptable_start": 6,
                "latest_acceptable_end": 22,
                "allowed_start_flexibility": 2,
                "allowed_end_flexibility": 1,
                "active_stay_start": 8,
                "active_stay_end": 23
            }
        }
    })

    const profile_trip_2 = await prisma.profile_trip.upsert({
        where: {id: 2},
        update: {},
        create: {

            profile: {
                connect: {id: profile2.id}
            },
            trip: {
                connect: {id: trip.id}
            },
            is_trip_owner: false,
            is_ready_to_optimize: false,
            trip_preferences_json: {
                "location_ratings": [5, 6.5, 9, 4.75, 2, 10, 9, 4.25, 7.25],
                "desired_time_in_location": [24, 36, 72, 24, 6, 96, 72, 24, 36],
                "road_travel_threshold": 10,
                "earliest_acceptable_start": 8,
                "latest_acceptable_end": 20,
                "allowed_start_flexibility": 2,
                "allowed_end_flexibility": 1,
                "active_stay_start": 6,
                "active_stay_end": 21
            }
        }
    })

    const profile_trip_3 = await prisma.profile_trip.upsert({
        where: {id: 3},
        update: {},
        create: {
            profile: {
                connect: {id: profile3.id}
            },
            trip: {
                connect: {id: trip.id}
            },
            is_trip_owner: false,
            is_ready_to_optimize: false,
            trip_preferences_json: {
                "location_ratings": [2, 3.6, 2.75, 8.75, 10, 5, 5, 6.5, 2],
                "desired_time_in_location": [6, 12, 6, 72, 120, 24, 24, 36, 6],
                "road_travel_threshold": 11,
                "earliest_acceptable_start": 7,
                "latest_acceptable_end": 21,
                "allowed_start_flexibility": 2,
                "allowed_end_flexibility": 1,
                "active_stay_start": 7.5,
                "active_stay_end": 22
            }
        }
    })

    await prisma.profile.update({
        where: { id: profile1.id },
        data: {
            profile_trip: {
                connect: { id: profile_trip_1.id }
            }
        }
    })

    await prisma.profile.update({
        where: { id: profile2.id },
        data: {
            profile_trip: {
                connect: { id: profile_trip_2.id }
            }
        }
    })

    await prisma.profile.update({
        where: { id: profile3.id },
        data: {
            profile_trip: {
                connect: { id: profile_trip_3.id }
            }
        }
    })

    await prisma.trip.update({
        where: { id: trip.id },
        data: {
            profile_trip: {
                connect: [
                    { id: profile_trip_1.id },
                    { id: profile_trip_2.id },
                    { id: profile_trip_3.id }
                ]
            }
        }
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
