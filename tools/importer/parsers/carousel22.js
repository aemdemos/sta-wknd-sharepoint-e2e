/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Carousel (carousel22)'];

  // Find carousel root and items
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  const itemsContainer = carouselRoot.querySelector('.cmp-carousel__content');
  if (!itemsContainer) return;
  const slideElements = Array.from(itemsContainer.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build slide rows
  const rows = slideElements.map((slideEl) => {
    // Find teaser content inside slide
    const teaser = slideEl.querySelector('.cmp-teaser');
    let imageCell = null;
    let textCell = document.createElement('div');

    // Image cell: find first img inside .cmp-teaser__image (mandatory)
    if (teaser) {
      const imageWrapper = teaser.querySelector('.cmp-teaser__image');
      if (imageWrapper) {
        const imgEl = imageWrapper.querySelector('img');
        if (imgEl) {
          imageCell = imgEl;
        }
      }
      // Text cell content
      // Use existing elements for text content (heading, paragraphs, links)
      const contentDiv = teaser.querySelector('.cmp-teaser__content');
      if (contentDiv) {
        // Title as heading
        const h2 = contentDiv.querySelector('.cmp-teaser__title');
        if (h2) {
          textCell.appendChild(h2);
        }
        // Description (may contain <p> or plain text)
        const desc = contentDiv.querySelector('.cmp-teaser__description');
        if (desc) {
          // If there are p tags, append them; otherwise, append the desc itself
          const pTags = desc.querySelectorAll('p');
          if (pTags.length > 0) {
            pTags.forEach(p => {
              textCell.appendChild(p);
            });
          } else if (desc.textContent.trim()) {
            // Some descriptions may be just text, wrap in <p>
            const p = document.createElement('p');
            p.textContent = desc.textContent.trim();
            textCell.appendChild(p);
          }
        }
        // Call-to-action: find .cmp-teaser__action-container > a
        const actionCtn = contentDiv.querySelector('.cmp-teaser__action-container');
        if (actionCtn) {
          const link = actionCtn.querySelector('a');
          if (link) {
            // Add a line break if there is already text
            if (textCell.childNodes.length > 0) {
              textCell.appendChild(document.createElement('br'));
            }
            textCell.appendChild(link);
          }
        }
      }
    }
    return [imageCell, textCell.childNodes.length > 0 ? textCell : ''];
  });

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
