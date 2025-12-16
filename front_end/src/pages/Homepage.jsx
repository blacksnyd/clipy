import CardVideo from '../components/CardVideo'
import ModalCreate from '../components/ModalCreate'

const Homepage = ({ videos = [], onCardClick, isModalOpen = false, onCloseModal }) => (
  <>
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={onCloseModal}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ModalCreate onClose={onCloseModal} />
        </div>
      </div>
    )}
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
  </>
)

export default Homepage
