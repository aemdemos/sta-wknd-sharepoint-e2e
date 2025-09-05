/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Table header row
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // For each slide, extract image and text content
  items.forEach((item) => {
    // Find image (mandatory)
    let imgEl = item.querySelector('img');
    if (!imgEl) {
      imgEl = item.querySelector('.cmp-image__image');
    }

    // Find text content (optional)
    let textCell = '';
    // Try to get all possible text content from the image block
    const imageDiv = item.querySelector('[data-cmp-is="image"]');
    let title = '';
    let caption = '';
    if (imgEl) {
      title = imgEl.getAttribute('title') || '';
      caption = imgEl.getAttribute('alt') || '';
    }
    // Try meta[itemprop="caption"]
    if (imageDiv) {
      const metaCaption = imageDiv.querySelector('meta[itemprop="caption"]');
      if (metaCaption && metaCaption.content) {
        caption = metaCaption.content;
      }
    }
    // Compose text cell if any text exists
    const textEls = [];
    if (title) {
      const heading = document.createElement('h2');
      heading.textContent = title;
      textEls.push(heading);
    }
    // Only add caption if it's not a duplicate of title
    if (caption && caption !== title) {
      const desc = document.createElement('p');
      desc.textContent = caption;
      textEls.push(desc);
    }
    // Defensive: include any other text nodes inside the item
    // (for future flexibility)
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textEls.push(p);
      }
    });
    textCell = textEls.length ? textEls : '';

    // Add row: [image, textCell]
    rows.push([imgEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
