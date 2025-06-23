/* global WebImporter */
export default function parse(element, { document }) {
  // The Video block is only created if a video or iframe is present inside the element
  // Otherwise, the element is left unchanged (no Video block)
  // The header row must be exactly: ['Video']
  // The second row should be a single cell, with a video link (and poster image if available)
  // Only non-img 'src' elements (iframe/video) get converted to a link

  // Find first iframe (common for embedded video)
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    const cells = [
      ['Video'],
      [link]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Find first video (native HTML5 video)
  const video = element.querySelector('video');
  if (video) {
    let videoSrc = video.src;
    if (!videoSrc) {
      const source = video.querySelector('source');
      if (source && source.src) videoSrc = source.src;
    }
    const link = document.createElement('a');
    link.href = videoSrc || '';
    link.textContent = videoSrc || '';
    let content;
    if (video.poster) {
      const posterImg = document.createElement('img');
      posterImg.src = video.poster;
      posterImg.alt = '';
      content = [posterImg, link];
    } else {
      content = [link];
    }
    const cells = [
      ['Video'],
      [content]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }
  // If no video or iframe is found, do not create or replace anything (no Video block)
}