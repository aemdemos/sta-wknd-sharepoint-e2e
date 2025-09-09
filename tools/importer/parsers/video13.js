/* global WebImporter */
export default function parse(element, { document }) {
  // Always create the Video (video13) block, but include all possible video-related content from the element
  const headerRow = ['Video (video13)'];
  let cellContent = [];

  // Try to find <video> elements
  const video = element.querySelector('video');
  if (video) {
    // Poster image if present
    if (video.poster) {
      const posterImg = document.createElement('img');
      posterImg.src = video.poster;
      posterImg.alt = '';
      cellContent.push(posterImg);
    }
    // Video source
    let src = video.currentSrc || video.src;
    if (!src) {
      const source = video.querySelector('source');
      if (source) src = source.src;
    }
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.textContent = src;
      cellContent.push(link);
    }
  }

  // Try to find <iframe> elements with video sources (e.g., YouTube, Vimeo)
  if (cellContent.length === 0) {
    const iframe = element.querySelector('iframe');
    if (iframe && iframe.src && /youtube|vimeo|wistia|dailymotion|player/.test(iframe.src)) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      cellContent.push(link);
    }
  }

  // Try to find a direct video link (e.g., .mp4, .mov, .webm)
  if (cellContent.length === 0) {
    const links = element.querySelectorAll('a[href]');
    for (const link of links) {
      if (/\.(mp4|mov|webm)(\?.*)?$/i.test(link.href)) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.href;
        cellContent.push(a);
        break;
      }
    }
  }

  // If still nothing, include any <source> with video mime type
  if (cellContent.length === 0) {
    const sources = element.querySelectorAll('source');
    for (const source of sources) {
      if (/video\//.test(source.type) && source.src) {
        const a = document.createElement('a');
        a.href = source.src;
        a.textContent = source.src;
        cellContent.push(a);
        break;
      }
    }
  }

  // --- CRITICAL FIX: If still nothing, do NOT include non-video links or images. Instead, output only the placeholder text. ---
  if (cellContent.length === 0) {
    cellContent = ['No video found'];
  }

  const rows = [headerRow, [cellContent]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
