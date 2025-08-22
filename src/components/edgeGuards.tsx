export default function EdgeGuards() {
    return (
      <>
        <div className="fixed left-0 top-0 h-screen z-[9999]" style={{ width: 32, touchAction: "none" }} />
        <div className="fixed right-0 top-0 h-screen z-[9999]" style={{ width: 32, touchAction: "none" }} />
      </>
    );
  }
  