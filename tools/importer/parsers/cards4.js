/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly matching the example
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Find the image list for cards
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((item) => {
      // First cell: image element (reference)
      let imgEl = null;
      const cmpImage = item.querySelector('img');
      if (cmpImage) imgEl = cmpImage;

      // Second cell: text content
      // Reference existing elements for semantic structure and robustness
      const cardContent = [];
      const article = item.querySelector('article');
      if (article) {
        // Title (prefer <span class="cmp-image-list__item-title"> inside a link, render as <h3>)
        const titleSpan = article.querySelector('.cmp-image-list__item-title');
        if (titleSpan && titleSpan.textContent.trim()) {
          const h3 = document.createElement('h3');
          h3.textContent = titleSpan.textContent.trim();
          cardContent.push(h3);
        }

        // Description
        const descSpan = article.querySelector('.cmp-image-list__item-description');
        if (descSpan && descSpan.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = descSpan.textContent.trim();
          cardContent.push(p);
        }

        // CTA link (must use href from the title link if present)
        // This block's example puts CTA at the bottom of the cell
        // If there's a title link, use it for CTA
        const titleLink = article.querySelector('.cmp-image-list__item-title-link');
        if (titleLink && titleLink.getAttribute('href')) {
          const cta = document.createElement('a');
          cta.href = titleLink.getAttribute('href');
          cta.textContent = 'Read More';
          cardContent.push(cta);
        }
      }
      // Ensure all text content is captured even if selectors miss
      if (cardContent.length === 0 && article) {
        // Fallback: add all text from the article
        cardContent.push(document.createTextNode(article.textContent.trim()));
      }
      cells.push([imgEl, cardContent]);
    });
  }
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
