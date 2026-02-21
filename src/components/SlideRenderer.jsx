import SummarySlide from './SummarySlide';
import ParticipantsSlide from './ParticipantsSlide';
import ActivitySlide from './ActivitySlide';
import CustomSlide from './CustomSlide';

export default function SlideRenderer({ slide }) {
  switch (slide.type) {
    case 'summary':
      return <SummarySlide slide={slide} />;
    case 'participants':
      return <ParticipantsSlide slide={slide} />;
    case 'activity':
      return <ActivitySlide slide={slide} />;
    case 'custom':
      return <CustomSlide slide={slide} />;
    default:
      return <div>Unknown slide type</div>;
  }
}
