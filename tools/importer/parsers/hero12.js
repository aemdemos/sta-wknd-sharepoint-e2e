/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  let teaserDiv = null;
  let imageEl = null;
  let titleEl = null;

  // Find the cmp-teaser--hero (hero block)
  const heroTeaser = element.querySelector('.cmp-teaser--hero');
  if (heroTeaser) {
    teaserDiv = heroTeaser;
    // Get image element (reference, not clone)
    const img = teaserDiv.querySelector('.cmp-teaser__image img');
    if (img) imageEl = img;
    // Get headline/title (reference, not clone)
    const title = teaserDiv.querySelector('.cmp-teaser__title');
    if (title) titleEl = title;
  }

  // Build table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [titleEl ? titleEl : ''];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace original element with the table
  element.replaceWith(table);
}
