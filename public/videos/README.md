# Hero gameplay clip

Put the hero video here as:

    public/videos/gameplay-clip.mp4

It then plays automatically in the hero slot — muted, looping, inline. If the
file is absent or fails to decode, the page falls back to the "Gameplay clip
coming soon" placeholder on its own; nothing else needs changing.

Recommendations:
- **Format:** .mp4, H.264 video + AAC audio (the audio track can be dropped —
  the player is muted). Widest browser support by a distance.
- **Aspect:** shoot/crop 9:16. The frame is `object-cover`, so anything else
  gets cropped, not letterboxed.
- **Size:** keep it under ~3 MB. It sits in the first viewport and every
  visitor downloads it. 5-10s of 720x1280 at ~1.5 Mbps lands in that budget.
- **Length:** 5-10 seconds. It loops, so a clean loop point matters more than
  duration.

To use a different filename, edit `GAMEPLAY_CLIP_SRC` at the top of
`app/page.tsx`.
