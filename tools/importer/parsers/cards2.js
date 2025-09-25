/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the magazine article list
  function extractCardsFromImageList(imageList) {
    const cards = [];
    const items = imageList.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      const img = li.querySelector('img');
      // Compose text content: title, description, and link
      const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
      const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
      const descriptionSpan = li.querySelector('span.cmp-image-list__item-description');
      // Compose cell content
      const textCell = document.createElement('div');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        textCell.appendChild(h3);
      }
      if (descriptionSpan) {
        const p = document.createElement('p');
        p.textContent = descriptionSpan.textContent;
        textCell.appendChild(p);
      }
      // Add CTA only if there is a link and it is not just for the image
      // Try to find a CTA link in the li (sometimes there is a separate link)
      let ctaLink = null;
      // Prefer a link that is not the image link
      const links = li.querySelectorAll('a');
      links.forEach((a) => {
        if (!a.classList.contains('cmp-image-list__item-image-link')) {
          ctaLink = a;
        }
      });
      if (ctaLink) {
        const cta = document.createElement('a');
        cta.href = ctaLink.href;
        cta.textContent = ctaLink.textContent || 'Read More';
        textCell.appendChild(cta);
      }
      cards.push([img, textCell]);
    });
    return cards;
  }

  // Find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Compose table rows
  const headerRow = ['Cards (cards2)'];
  const cardRows = extractCardsFromImageList(imageList);
  const tableRows = [headerRow, ...cardRows];

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
