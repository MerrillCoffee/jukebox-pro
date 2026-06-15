import express from "express";
import { createPlaylist, getPlaylistsByUserId, getPlaylistById } from "#db/queries/playlists";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.use(getUserFromToken, requireUser);

router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylistsByUserId(req.user.id);
    res.send(playlists);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireBody(["name", "description"]), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  } catch (error) {
    next(error);
  }
});

async function requireOwnership(req, res, next) {
  try {
    const playlist = await getPlaylistById(req.params.id);
    if (!playlist) return res.status(404).send("Playlist not found");
    if (playlist.user_id !== req.user.id) return res.status(403).send("Forbidden");
    
    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
}

router.get("/:id", requireOwnership, (req, res) => {
  res.send(req.playlist);
});

router.get("/:id/tracks", requireOwnership, async (req, res, next) => {
  try {
    const tracks = await getTracksByPlaylistId(req.params.id);
    res.send(tracks);
  } catch (e) { 
    next(e); 
  }
});

router.post("/:id/tracks", requireOwnership, requireBody(["trackId"]), async (req, res, next) => {
  try {
    const result = await createPlaylistTrack(req.params.id, req.body.trackId);
    res.status(201).send(result);
  } catch (e) { 
    next(e); 
  }
});

export default router;