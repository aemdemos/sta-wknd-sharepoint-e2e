/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Defensive: Find the article content
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Find image (first cell)
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageEl = img;
        }
      }
    }
    // Defensive fallback: if not found, skip this card
    if (!imageEl) return;

    // Find title (span)
    let titleSpan = article.querySelector('.cmp-image-list__item-title');
    // Find description (span)
    let descSpan = article.querySelector('.cmp-image-list__item-description');
    // Find CTA link (title link)
    let ctaLink = article.querySelector('.cmp-image-list__item-title-link');

    // Compose text cell contents
    const textCell = [];
    // Title as heading
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCell.push(heading);
    }
    // Description
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.push(descP);
    }
    // CTA link
    if (ctaLink) {
      // Only add if href exists and is not just '#'
      if (ctaLink.href && ctaLink.getAttribute('href') && ctaLink.textContent.trim()) {
        const link = document.createElement('a');
        link.href = ctaLink.getAttribute('href');
        link.textContent = ctaLink.textContent.trim();
        textCell.push(link);
      }
    }

    // Add row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
