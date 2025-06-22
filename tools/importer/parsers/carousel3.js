/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row matches exactly the provided name
  const headerRow = ['Carousel (carousel3)'];

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all the slide items
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  const rows = [headerRow];

  items.forEach((item) => {
    // Image in the first cell, find the first img inside cmp-teaser__image
    let imgEl = null;
    const teaserImage = item.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imgEl = teaserImage;
    }

    // Text content cell
    const textEls = [];
    // Title: keep the heading element as is
    const title = item.querySelector('.cmp-teaser__title');
    if (title) textEls.push(title);
    // Description: push entire description div (may contain p or plain text)
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) textEls.push(desc);
    // CTA(s): add any links in the cmp-teaser__action-container
    const ctaContainer = item.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      // Add all links in the container
      const ctas = Array.from(ctaContainer.querySelectorAll('a'));
      ctas.forEach((cta) => textEls.push(cta));
    }

    // If no content, leave cell empty
    const row = [imgEl, textEls.length === 1 ? textEls[0] : textEls];
    rows.push(row);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
