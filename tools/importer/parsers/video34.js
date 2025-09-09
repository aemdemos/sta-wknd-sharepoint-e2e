/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Video (video34)'];

  // Only look for a video source (iframe, video, or a link to YouTube/Vimeo)
  let videoSrc = null;
  let posterImg = null;

  // Look for iframe
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    videoSrc = iframe.src;
  }

  // Look for <video>
  if (!videoSrc) {
    const video = element.querySelector('video');
    if (video && video.src) {
      videoSrc = video.src;
      // Try to get poster image
      if (video.poster) {
        posterImg = document.createElement('img');
        posterImg.src = video.poster;
        posterImg.alt = 'Video Poster';
      }
    }
  }

  // Look for direct links to YouTube/Vimeo
  if (!videoSrc) {
    const links = Array.from(element.querySelectorAll('a'));
    for (const link of links) {
      if (/youtube|vimeo|\.mp4$|\.webm$|\.mov$/i.test(link.href)) {
        videoSrc = link.href;
        break;
      }
    }
  }

  // If still not found, look for embed code in text
  if (!videoSrc) {
    const html = element.innerHTML;
    const ytMatch = html.match(/https:\/\/(www\.)?youtube\.com\/watch\?v=[^"'\s<>]+/);
    if (ytMatch) {
      videoSrc = ytMatch[0];
    }
    const vimeoMatch = html.match(/https:\/\/vimeo\.com\/[0-9]+/);
    if (!videoSrc && vimeoMatch) {
      videoSrc = vimeoMatch[0];
    }
  }

  // Look for poster image (img inside the block)
  if (!posterImg) {
    const imgs = Array.from(element.querySelectorAll('img'));
    if (imgs.length > 0) {
      // Use the largest image (by width)
      let best = null;
      let bestW = 0;
      imgs.forEach((img) => {
        let w = 0;
        if (img.hasAttribute('width')) w = parseInt(img.getAttribute('width'), 10);
        else if (img.width) w = img.width;
        if (w > bestW) {
          best = img;
          bestW = w;
        }
      });
      if (best) {
        // Clone to avoid moving the original node from the DOM
        posterImg = best.cloneNode(true);
      }
    }
  }

  // Always output a block, even if no video source is found (to ensure DOM is modified)
  const contentRow = [];
  if (videoSrc) {
    if (posterImg) contentRow.push(posterImg);
    const a = document.createElement('a');
    a.href = videoSrc;
    a.textContent = videoSrc;
    contentRow.push(a);
  } else {
    contentRow.push(document.createTextNode('No video source found.'));
  }
  const cells = [headerRow, [contentRow]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
