/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (surf spots)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Gather all children for easier traversal
  const children = Array.from(elementsContainer.children);

  // Prepare array for card rows
  const cards = [];

  // --- Intro Card (first image + first p) ---
  let introImage = null;
  let introText = null;
  for (let i = 0; i < children.length; i++) {
    if (!introImage && children[i].querySelector && children[i].querySelector('[data-cmp-is="image"]')) {
      introImage = children[i].querySelector('[data-cmp-is="image"]');
    }
    if (!introText && children[i].tagName === 'P') {
      introText = children[i];
    }
    if (introImage && introText) break;
  }
  if (introImage && introText) {
    cards.push([introImage, introText]);
  }

  // --- Surf Spot Cards ---
  let i = 0;
  while (i < children.length) {
    if (children[i].tagName === 'H2') {
      const title = children[i];
      let image = null;
      let description = null;
      let j = i + 1;
      // Find next image
      while (j < children.length && !image) {
        if (children[j].querySelector && children[j].querySelector('[data-cmp-is="image"]')) {
          image = children[j].querySelector('[data-cmp-is="image"]');
          j++;
          break;
        }
        j++;
      }
      // Find next <p>
      while (j < children.length && !description) {
        if (children[j].tagName === 'P') {
          description = children[j];
          break;
        }
        j++;
      }
      if (image && description) {
        cards.push([image, [title, description]]);
      }
      i = j + 1;
      continue;
    }
    i++;
  }

  // Table header
  const headerRow = ['Cards (cards16)'];

  // Compose table rows
  const tableRows = cards.map(([img, txt]) => [img, txt]);

  // Ensure there are at least two columns and multiple rows
  if (tableRows.length === 0) return;

  // Build the table
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  if (block && block !== element) {
    element.replaceWith(block);
  }
}
