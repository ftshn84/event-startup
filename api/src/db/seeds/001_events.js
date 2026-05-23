const seedData = [
    {
        title: "Copenhagen Coffee Crawl",
        description:
            "A relaxed Saturday walk between 4 specialty cafes. Includes tasting notes, small pastry, and a guide to brewing styles.",
        date: "2026-06-14 10:00:00",
        venue: "Norrebro Coffee District",
        price: 100,
        capacity: 40,
    },
    {
        title: "After-Work Board Games Night",
        description:
            "Drop in with friends or come solo. We'll teach quick games, set you up at a table, and keep the vibe cozy and social.",
        date: "2026-06-18 18:30:00",
        venue: "City Commons Cafe",
        price: 150,
        capacity: 60,
    },
    {
        title: "Beginner Pasta Workshop",
        description:
            "Hands-on workshop: mix dough, roll sheets, shape pasta, and finish with a simple sauce. You'll leave with a small take-home pack.",
        date: "2026-06-21 14:00:00",
        venue: "Studio Kitchen Copenhagen",
        price: 250,
        capacity: 20,
    },
    {
        title: "Sunday Park Run & Stretch",
        description:
            "Easy-paced community run (5K-ish) followed by guided stretching. All levels welcome-walkers included.",
        date: "2026-06-28 09:00:00",
        venue: "Frederiksberg Park",
        price: 0,
        capacity: 120,
    },
    {
        title: "Indie Film Screening: Short Nights",
        description:
            "A curated set of local short films with a short Q&A after. Seats are limited-arrive early for the best spots.",
        date: "2026-07-02 19:30:00",
        venue: "Baltic Cinema Room",
        price: 75,
        capacity: 85,
    },
    {
        title: "Photography Walk: City Lights",
        description:
            "Evening photo walk focused on street scenes and reflections. Bring any camera-even a phone-and we'll share tips on composition and exposure.",
        date: "2026-07-05 21:00:00",
        venue: "Nyhavn Metro Exit",
        price: 180,
        capacity: 25,
    },
    {
        title: "Bread & Butter Tasting",
        description:
            "Taste 6 breads and 5 butters (classic + flavored). Learn what makes a good crumb, crust, and fermentation-and why butter matters.",
        date: "2026-07-10 11:30:00",
        venue: "Bakery Lab",
        price: 120,
        capacity: 30,
    },
    {
        title: "Live Jazz Trio at the Loft",
        description:
            "An intimate set with modern standards and originals. Ticket includes a welcome drink; doors open 19:00.",
        date: "2026-07-16 20:00:00",
        venue: "The Loft Sessions",
        price: 300,
        capacity: 70,
    },
];

/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("events").del();

    await knex("events").insert(seedData);
}