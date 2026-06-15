import express from "express";
import { getPlaylistsByTrackId } from "#db/queries/playlists";
import { getTrackById } from "#db/queries/tracks";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.get("/:id/playlists", getUserFromToken, requireUser, async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found");

    const playlists = await getPlaylistsByTrackId(req.params.id, req.user.id);
    res.send(playlists);
  } catch(e) { 
    next(e); 
  }
});

export default router;