import CardVideo from '../components/CardVideo'

const Homepage = ({ videos = [], onCardClick }) => (
  <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => (
        <CardVideo
          key={video?.id ?? index}
          video={video}
          onClick={onCardClick ? () => onCardClick(video) : undefined}
        />
      ))}
    </div>
  </section>
)

export default Homepage
