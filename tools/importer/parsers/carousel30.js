/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first direct child with a class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Table header
  const headerRow = ['Carousel (carousel30)'];
  const rows = [headerRow];

  // 2. Find the carousel root (the element itself)
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) {
    carousel = element;
  }
  if (!carousel) return;

  // 3. Find all slides (items)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Find image: look for .cmp-image__image inside .cmp-image
    let imageEl = null;
    const imageContainer = item.querySelector('.cmp-image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img.cmp-image__image');
    }
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }
    const imgCell = imageEl ? imageEl : '';

    // Second cell: text content (optional)
    let textCell = '';
    // Try to find a caption in <meta itemprop="caption"> or alt/title attributes
    let caption = '';
    const metaCaption = imageContainer ? imageContainer.querySelector('meta[itemprop="caption"]') : null;
    if (metaCaption && metaCaption.content) {
      caption = metaCaption.content;
    } else if (imageEl && imageEl.getAttribute('title')) {
      caption = imageEl.getAttribute('title');
    } else if (imageEl && imageEl.getAttribute('alt')) {
      caption = imageEl.getAttribute('alt');
    }

    // Try to find additional text content within the slide
    // Look for headings, paragraphs, and links that are not part of the image
    const textFragments = [];
    // Headings
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textFragments.push(heading.cloneNode(true));
    } else if (caption) {
      // If no heading, use caption as heading
      const headingEl = document.createElement('h2');
      headingEl.textContent = caption;
      textFragments.push(headingEl);
    }
    // Paragraphs
    item.querySelectorAll('p').forEach((p) => {
      textFragments.push(p.cloneNode(true));
    });
    // Links (CTA)
    item.querySelectorAll('a').forEach((a) => {
      textFragments.push(a.cloneNode(true));
    });

    // If no heading, paragraph, or link, but have caption, add as plain text
    if (textFragments.length === 0 && caption) {
      textFragments.push(document.createTextNode(caption));
    }
    if (textFragments.length > 0) {
      textCell = textFragments;
    }

    rows.push([imgCell, textCell]);
  });

  // 4. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
