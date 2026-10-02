function SkeletonList({ count = 3 }) {
  return (
    <div aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton skeleton-box" />
          <div className="skeleton-body">
            <div className="skeleton skeleton-line wide" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonList;