import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import './index.less';

const LateralScrollContainer = ({
  direction,
  children,
}: PropsWithChildren<{ direction?: 'right' | 'left' | 'center' }>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    const container = containerRef.current;

    if (!scroller || !container) return;

    const maxScrollLeft = scroller.scrollWidth - container.clientWidth;
    setShowLeftShadow(scroller.scrollLeft > 0);
    setShowRightShadow(scroller.scrollLeft < maxScrollLeft);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scroller.scrollLeft += e.deltaX;
    } else {
      scroller.scrollLeft += e.deltaY;
    }
    handleScroll();
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    const container = containerRef.current;

    const observer = new ResizeObserver(() => {
      handleScroll();
    });

    if (container) {
      observer.observe(container);
    }

    handleScroll();

    if (scroller) {
      scroller.addEventListener('scroll', handleScroll);
      scroller.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (scroller) {
        scroller.removeEventListener('scroll', handleScroll);
        scroller.removeEventListener('wheel', handleWheel);
      }
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  return (
    <div
      className="container"
      ref={containerRef}
      style={{ justifyContent: direction || 'left' }}
    >
      {showLeftShadow && <div className="inner-shadow-left" />}
      <div className="scroller" ref={scrollerRef}>
        {children}
      </div>
      {showRightShadow && <div className="inner-shadow-right" />}
    </div>
  );
};

export default LateralScrollContainer;
