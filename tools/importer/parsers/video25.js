/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Video (video25)'];

  // Only look for video, iframe, or direct video links (do NOT add unrelated text)
  let cellContent = [];

  // 1. <video> tag
  let videoEl = element.querySelector('video');
  if (videoEl && videoEl.src) {
    // Optionally add poster image first
    if (videoEl.poster) {
      const posterImg = document.createElement('img');
      posterImg.src = videoEl.poster;
      posterImg.alt = '';
      cellContent.push(posterImg);
    }
    cellContent.push(videoEl.cloneNode(true));
  } else {
    // 2. <iframe> (YouTube, Vimeo, etc)
    let iframeEl = element.querySelector('iframe[src]');
    if (iframeEl) {
      const link = document.createElement('a');
      link.href = iframeEl.src;
      link.textContent = iframeEl.src;
      cellContent.push(link);
    } else {
      // 3. Direct video link
      let linkEl = Array.from(element.querySelectorAll('a')).find(a => a.href && (a.href.match(/youtube.com|youtu.be|vimeo.com|\.mp4$/i)));
      if (linkEl) {
        const link = document.createElement('a');
        link.href = linkEl.href;
        link.textContent = linkEl.href;
        cellContent.push(link);
      }
    }
  }

  // If nothing found, still replace with a minimal block (to always modify the DOM)
  if (cellContent.length === 0) {
    cellContent = ['No video found'];
  }

  const rows = [
    headerRow,
    [cellContent.length === 1 ? cellContent[0] : cellContent],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
