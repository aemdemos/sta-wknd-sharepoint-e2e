/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide content given a carousel item
  function extractSlideContent(item) {
    // Find teaser block (may not exist in all versions)
    const teaser = item.querySelector('.cmp-teaser');
    let imageEl = null;
    let textContent = [];

    // IMAGE: Required, always first cell
    if (teaser) {
      const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
      if (teaserImageDiv) {
        imageEl = teaserImageDiv.querySelector('img');
      }
    }
    // Fallback if not found in teaser
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // TEXT: Optional, second cell
    if (teaser) {
      const teaserContent = teaser.querySelector('.cmp-teaser__content');
      if (teaserContent) {
        // Title as heading (use closest h1-h6, keep as existing element)
        const heading = teaserContent.querySelector('.cmp-teaser__title');
        if (heading) {
          textContent.push(heading);
        }
        // Description
        const desc = teaserContent.querySelector('.cmp-teaser__description');
        if (desc) {
          // Push all block-level content in description (e.g. paragraphs), preserving tags
          desc.childNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              textContent.push(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
              const txt = node.textContent.trim();
              if (txt.length > 0) {
                const p = document.createElement('p');
                p.textContent = txt;
                textContent.push(p);
              }
            }
          });
        }
        // CTA (link)
        const cta = teaserContent.querySelector('.cmp-teaser__action-link');
        if (cta) {
          // Put link on its own line
          const p = document.createElement('p');
          p.appendChild(cta);
          textContent.push(p);
        }
      }
    }

    // Clean up textContent: flatten single item arrays, filter empty
    textContent = textContent.filter(Boolean);

    return [imageEl, textContent.length > 0 ? textContent : ''];
  }

  // Find the main carousel inside the element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Prepare table rows
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];

  slides.forEach((item) => {
    const [imageEl, textContent] = extractSlideContent(item);
    // Only add slide if there is an image (required)
    if (imageEl) {
      rows.push([imageEl, textContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
