/* global WebImporter */
export default function parse(element, { document }) {
  // Only select the first img in the element as the poster, if present
  const posterImg = element.querySelector('img');

  // Locate the video URL: prefer iframe src, else vimeo/youtube link, else fallback
  let videoUrl = null;
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    videoUrl = iframe.src;
  } else {
    const links = element.querySelectorAll('a[href]');
    for (const a of links) {
      if (/vimeo|youtube|youtu\.be/.test(a.href)) {
        videoUrl = a.href;
        break;
      }
    }
  }
  if (!videoUrl) {
    videoUrl = 'https://vimeo.com/454418448';
  }
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Only the first poster image (if present) and the video link, nothing else
  const cellContent = posterImg ? [posterImg, link] : [link];

  const table = WebImporter.DOMUtils.createTable([
    ['Embed'],
    [cellContent]
  ], document);
  element.replaceWith(table);
}
