/** Decorative self-hosted video: no player UI, embeds, or third-party scripts. */
export default function BackgroundVideo({ src, poster }: { src: string; poster: string }) {
  return (
    <video
      className="pl-background-video pointer-events-none absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
