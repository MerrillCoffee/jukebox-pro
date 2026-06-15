import db from "#db/client";
import "dotenv/config";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  const user1 = await createUser("musicfan99", "hashedpass1");
  const user2 = await createUser("dj_spinz", "hashedpass2");

  const p1 = await createPlaylist("Chill Vibes", "Relaxing tracks", user1.id);
  for (let i = 1; i <= 6; i++) {
    await createPlaylistTrack(p1.id, i);
  }

  const p2 = await createPlaylist("Workout Mix", "High energy", user2.id);
  for (let i = 7; i <= 13; i++) {
    await createPlaylistTrack(p2.id, i);
  }
}