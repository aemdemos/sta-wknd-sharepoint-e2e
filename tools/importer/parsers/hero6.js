/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root (.teaser.cmp-teaser--hero)
  const hero = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!hero) return;

  // Extract image element (background image)
  let imageEl = null;
  const imageContainer = hero.querySelector('.cmp-teaser__image .cmp-image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) imageEl = img;
  }

  // Extract heading/title (styled as heading)
  let headingEl = null;
  const contentContainer = hero.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    headingEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (!headingEl && contentContainer.firstElementChild) {
      headingEl = contentContainer.firstElementChild;
    }
    // Trim whitespace from heading text
    if (headingEl && headingEl.textContent) {
      headingEl.textContent = headingEl.textContent.trim();
    }
  }

  // Find separator <hr>
  const separator = element.querySelector('.cmp-separator__horizontal-rule');
  let separatorEl = '';
  if (separator) {
    separatorEl = separator.cloneNode(true);
  }

  // Compose table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Place heading and separator together in the third row
  const contentRow = separatorEl ? [ [headingEl ? headingEl : '', separatorEl] ] : [headingEl ? headingEl : ''];

  // Create table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
