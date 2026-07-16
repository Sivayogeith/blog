export default function Video(
  props: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >,
) {
  return (
    <video controls preload="auto" {...props}>
      <source src={props.src as string}/>
      {/* <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      /> */}
      Your browser does not support the video tag.
    </video>
  );
}
