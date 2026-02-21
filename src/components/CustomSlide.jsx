export default function CustomSlide({ slide }) {
  // Split content by newlines and filter out empty lines
  const bulletPoints = slide.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div className="slide custom-slide">
      <h2 className="slide-title">{slide.title}</h2>
      <div className="custom-slide-content">
        {bulletPoints.length > 0 ? (
          <ul className="bullet-list">
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-content">No content added</p>
        )}
      </div>
    </div>
  );
}
