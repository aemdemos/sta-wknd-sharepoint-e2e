/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, matches example exactly
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Find main carousel content
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const items = Array.from(carouselContent.children).filter(child => child.classList.contains('cmp-carousel__item'));

  items.forEach(item => {
    let imageCell = null;
    let textCell = [];

    // Image cell: find .cmp-teaser__image img, otherwise first img inside item
    const teaserImageWrap = item.querySelector('.cmp-teaser__image');
    if (teaserImageWrap) {
      const teaserImage = teaserImageWrap.querySelector('img');
      if (teaserImage) imageCell = teaserImage;
      else imageCell = teaserImageWrap;
    } else {
      // fallback: first img in item
      const img = item.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell: find .cmp-teaser__content (teaser text area)
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        // Use as h2 if it's not already a heading
        if (!/^h\d$/i.test(title.tagName)) {
          const h2 = document.createElement('h2');
          h2.textContent = title.textContent;
          textCell.push(h2);
        } else {
          textCell.push(title);
        }
      }
      // Description: get all children of .cmp-teaser__description
      const description = teaserContent.querySelector('.cmp-teaser__description');
      if (description) {
        // If contains <p> or other block elements, preserve them
        Array.from(description.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            textCell.push(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // wrap text in <p>
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textCell.push(p);
          }
        });
      }
      // CTA button or link
      const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        // get all links
        Array.from(actionContainer.querySelectorAll('a')).forEach(link => {
          textCell.push(link);
        });
      }
    }

    // Only add row if there is at least image or text
    if (imageCell || textCell.length > 0) {
      cells.push([
        imageCell,
        textCell.length > 0 ? textCell : ''
      ]);
    }
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
