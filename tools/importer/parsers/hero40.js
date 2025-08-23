/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Header row (always block name, exactly as specified)
  const headerRow = ['Hero (hero40)'];

  // Step 2: Background image row
  // Extract the main image element (should be a reference, not a clone)
  let img = '';
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    const cmpImage = teaserImage.querySelector('.cmp-image');
    if (cmpImage) {
      const foundImg = cmpImage.querySelector('img');
      if (foundImg) {
        img = foundImg; // reference directly
      }
    }
  }
  const imageRow = [img];

  // Step 3: Text content row (headline, subheadline, description, CTA)
  const content = element.querySelector('.cmp-teaser__content');
  // Collect all relevant direct children in order
  const textParts = [];
  if (content) {
    // 1. Pretitle (Featured Article)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textParts.push(pretitle);
    }
    // 2. Title (as heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textParts.push(title); // keep semantic h2
    }
    // 3. Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textParts.push(desc);
    }
    // 4. CTA link (Full Article)
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('.cmp-teaser__action-link');
      if (ctaLink) {
        textParts.push(ctaLink);
      }
    }
  }
  const textRow = [textParts];

  // Compose the table, per the specification: 1 column, 3 rows (header, image, text)
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the structured table
  element.replaceWith(table);
}
