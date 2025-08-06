/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel slide items
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Table: header is block name as in example
  const rows = [['Carousel (carousel10)']];

  items.forEach((item) => {
    // IMAGE: always required. Find image inside each slide/teaser
    let img = null;
    const teaserImageDiv = item.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      img = teaserImageDiv.querySelector('img');
    }
    // fallback in case structure changes
    if (!img) {
      img = item.querySelector('img');
    }

    // TEXT CONTENT: title (heading), description, CTA (link)
    const contentArr = [];
    // Title: use the actual heading element
    let title = item.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (title) contentArr.push(title);

    // Description: allow for <div> or <p>
    let desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      // If <p> children, use them individually to preserve markup
      const ps = desc.querySelectorAll('p');
      if (ps.length > 0) {
        ps.forEach(p => contentArr.push(p));
      } else {
        contentArr.push(desc);
      }
    }

    // CTA: .cmp-teaser__action-link or any <a> in .cmp-teaser__action-container
    let cta = item.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');
    if (cta) contentArr.push(cta);

    // Only add row if image is found (required for carousel slide)
    if (img) {
      rows.push([img, contentArr]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
