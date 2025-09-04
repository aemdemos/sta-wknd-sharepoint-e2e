/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Carousel (carousel39)'];
  const rows = [headerRow];

  // Defensive: find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Find image element (mandatory)
    let imgEl = null;
    const imgContainer = item.querySelector('.cmp-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Defensive: skip if no image
    if (!imgEl) return;

    // Find text content (optional)
    let textCell = '';
    // Try to find any text content in the slide (not just caption/title)
    // Look for headings, paragraphs, links, etc. inside the slide
    const textFragments = [];
    // Get all text nodes except image
    // Look for heading elements
    const headings = item.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => {
      const heading = document.createElement(h.tagName);
      heading.textContent = h.textContent;
      textFragments.push(heading);
    });
    // Look for paragraphs
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => {
      const para = document.createElement('p');
      para.textContent = p.textContent;
      textFragments.push(para);
    });
    // Look for links
    const links = item.querySelectorAll('a');
    links.forEach(a => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent;
      textFragments.push(link);
    });
    // If no headings/paragraphs/links, fallback to caption/title
    if (textFragments.length === 0) {
      // Try meta[itemprop="caption"] first
      const metaCaption = imgContainer ? imgContainer.querySelector('meta[itemprop="caption"]') : null;
      const caption = metaCaption ? metaCaption.getAttribute('content') : '';
      // Try image title attribute if no caption
      const imgTitle = imgEl.getAttribute('title') || '';
      const text = caption || imgTitle;
      if (text) {
        const heading = document.createElement('h2');
        heading.textContent = text;
        textFragments.push(heading);
      }
    }
    // If we have fragments, use them; else empty string
    textCell = textFragments.length ? textFragments : '';
    // Add row: [image, textCell]
    rows.push([imgEl, textCell]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
