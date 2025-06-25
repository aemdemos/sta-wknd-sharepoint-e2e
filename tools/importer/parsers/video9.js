/* global WebImporter */
export default function parse(element, { document }) {
  // The source HTML provided does NOT contain a video, iframe, or any Youtube/Vimeo link.
  // However, the example markdown and screenshot clearly represent a Video block with:
  // - a poster image
  // - a link to the video (e.g. https://www.youtube.com/watch?v=RGSN4S5jn4o)
  // The screenshot shows a poster image with the text 'Adobe Photoshop' overlaid.
  // Since the HTML does not expose the video iframe/embed or link, we must extract them if present.
  // In a real-case, we should always look for: iframe[src], video[src], or source[src], or a data-video/link attribute, and a poster image if present.
  // If no video or link is found, do not output a Video block.

  // Try to find iframe or video element, or a link to a video platform
  let videoSrc = '';
  let posterImg = null;

  // 1. Check for <iframe src=...>
  const iframe = element.querySelector('iframe[src]');
  if (iframe) {
    videoSrc = iframe.src;
    // Look for poster image nearby? (not present in HTML)
  }

  // 2. Check for <video> or <source>
  if (!videoSrc) {
    const video = element.querySelector('video');
    if (video) {
      videoSrc = video.src || (video.querySelector('source[src]') && video.querySelector('source[src]').src) || '';
      posterImg = video.poster ? (() => {
        const img = document.createElement('img');
        img.src = video.poster;
        img.alt = '';
        return img;
      })() : null;
    }
  }

  // 3. Check for a link to Youtube/Vimeo/etc. (any <a href=...youtube...> or ...vimeo...)
  if (!videoSrc) {
    const anchors = element.querySelectorAll('a[href]');
    for (const a of anchors) {
      if (/youtube|vimeo/.test(a.href)) {
        videoSrc = a.href;
        break;
      }
    }
  }

  // 4. If still not found, check for a data attribute (not present in the HTML)
  // 5. Poster image: Try to find a prominent image (often first image in the element)
  if (!posterImg) {
    // If the block has an image that looks like a poster, use it
    // We'll use the first <img> as the poster if present.
    const img = element.querySelector('img');
    if (img) {
      posterImg = img;
    }
  }

  // 6. Title: Look for a heading or prominent overlayed text, fallback to empty
  let titleText = '';
  // Try for h1/h2/h3/h4/h5 in element
  let titleEl = element.querySelector('h1, h2, h3, h4, h5');
  if (titleEl) {
    titleText = titleEl.textContent.trim();
  }

  // If we have a video source, build the Video block
  if (videoSrc) {
    const headerRow = ['Video'];

    // Compose cell contents: poster image and video link (as <a>)
    const cellContent = [];
    if (posterImg) cellContent.push(posterImg);
    const videoLink = document.createElement('a');
    videoLink.href = videoSrc;
    videoLink.textContent = videoSrc;
    videoLink.target = '_blank';
    cellContent.push(document.createElement('br'));
    cellContent.push(videoLink);

    const cells = [
      headerRow,
      [cellContent]
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
