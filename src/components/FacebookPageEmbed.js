import React, { useEffect, useRef } from 'react';

const FacebookPageEmbed = () => {
  const fbContainerRef = useRef(null);

  useEffect(() => {
    // Clearing any existing content in the container
    fbContainerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FFLEALA%2F&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId";
    iframe.width = "340";
    iframe.height = "500";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";

    fbContainerRef.current.appendChild(iframe);
  }, []);

  return (
    <div>
      <h2>Follow Us on Facebook</h2>
      <div ref={fbContainerRef} className="fb-page" />
    </div>
  );
};

export default FacebookPageEmbed;
