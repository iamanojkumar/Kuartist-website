"use strict";

(function () {
  // Pull React hooks from the global React object
  const { useState, useRef, useEffect, Children } = React;

  // Instead of using CARDS = 10,
  // define the data for the 10 cards you want to display:
  const cardData = [
    {
      backgroundImageUrl: "https://i.postimg.cc/wj2MjFTh/Get-replies-marketing-campaigns.png",
      linkUrl: "https://example.com/project1",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/T3GTzmxB/sites-thumnail.png",
      linkUrl: "https://example.com/project2",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/NfRGFtxh/gert-replies-thumnail.png",
      linkUrl: "https://example.com/project3",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/Njh2rkVK/hero-section-animation.gif",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/rF3P56Sb/card.png",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/63K3s1cb/prj-1.png",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/fLvbMjgz/prj-2.png",
    },
    {
      backgroundImageUrl: "https://picsum.photos/400/600?random=8",
      linkUrl: "https://example.com/project8",
    },
    {
      backgroundImageUrl: "https://i.postimg.cc/43WfsMdc/image-1.png",
      linkUrl: "https://example.com/project9",
    },
    {
      backgroundImageUrl: "https://picsum.photos/400/600?random=10",
      linkUrl: "https://example.com/project10",
    },
  ];

  const MAX_VISIBILITY = 2;
  const SCROLL_THRESHOLD = 100;

  // Updated Card component without h2/p,
  // and using a background image with a clickable link.
  function Card({ backgroundImageUrl, linkUrl }) {
    return React.createElement(
      "a",
      {
        className: "card",
        href: linkUrl,
        target: "_blank", // opens in a new tab
        style: {
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "block", // Make sure the card is displayed as a block/inline-block
          width: "368px",   // Just an example; adjust as needed
          height: "368px",  // Just an example; adjust as needed
          textDecoration: "none", // Remove underline from anchor
        },
      },
      // No child elements since we're just using the background image
      null
    );
  }

  function Carousel({ children }) {
    const count = Children.count(children);

    // Start with the card in the middle
    const initialActive = Math.floor(count / 2);
    const [active, setActive] = useState(initialActive);

    // Track partial scroll to decide when to switch to the next card
    const [scrollPos, setScrollPos] = useState(0);
    const carouselRef = useRef(null);

    const handleWheel = (event) => {
      event.preventDefault();
      const deltaY = event.deltaY;
      setScrollPos((prev) => prev + deltaY);

      // If we exceed the threshold, move to next/previous card
      if (Math.abs(scrollPos + deltaY) >= SCROLL_THRESHOLD) {
        if (deltaY > 0) {
          // Scroll down
          setActive((prev) => Math.min(prev + 1, count - 1));
        } else {
          // Scroll up
          setActive((prev) => Math.max(prev - 1, 0));
        }
        setScrollPos(0);
      }
    };

    useEffect(() => {
      const element = carouselRef.current;
      element.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        element.removeEventListener("wheel", handleWheel, { passive: false });
      };
    }, [scrollPos]);

    return React.createElement(
      "div",
      { className: "carousel", ref: carouselRef },
      Children.map(children, (child, i) => {
        // "distance" is the raw difference in indices
        const distance = Math.abs(active - i);

        // We still scale the transform by dividing the difference by 3
        const offset = (active - i) / 3;
        const absOffset = Math.abs(offset);

        return React.createElement(
          "div",
          {
            className: "card-container",
            key: i,
            style: {
              "--offset": offset,
              "--abs-offset": absOffset,
              "--direction": Math.sign(offset),
              "--active": i === active ? 1 : 0,

              // If a card is more than MAX_VISIBILITY away (in index terms), hide it
              opacity: distance > MAX_VISIBILITY ? "0" : "1",
              display: distance > MAX_VISIBILITY ? "none" : "block",

              // Only let pointer events fall through if it's the active card
              pointerEvents: i === active ? "auto" : "none"
            }
          },
          child
        );
      })
    );
  }

  function App() {
    // Generate the cards using the 'cardData' array
    const cards = cardData.map((data, index) =>
      React.createElement(Card, {
        key: index,
        backgroundImageUrl: data.backgroundImageUrl,
        linkUrl: data.linkUrl,
      })
    );

    return React.createElement(
      "div",
      { className: "app" },
      React.createElement(Carousel, null, cards)
    );
  }

  // Render our App into #root
  ReactDOM.render(
    React.createElement(App, null),
    document.getElementById("root")
  );
})();
