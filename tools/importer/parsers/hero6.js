/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root
  const heroRoot = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!heroRoot) return;

  // Find the background image (reference the actual image element)
  let imageEl = null;
  const imageContainer = heroRoot.querySelector('.cmp-teaser__image .cmp-image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find the headline/title (reference the heading element)
  let titleEl = null;
  const contentDiv = heroRoot.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Accept any heading level
    titleEl = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose the third row cell: title, subheading, CTA (all optional)
  const contentCell = document.createElement('div');
  if (titleEl) contentCell.appendChild(titleEl.cloneNode(true));
  // If there were subheading or CTA, they would be added here

  // Build the table rows
  const headerRow = ['Hero (hero6)']; // Must match target block name exactly
  const imageRow = [imageEl ? imageEl.cloneNode(true) : '']; // Use a clone for safety
  const contentRow = [contentCell.childNodes.length ? contentCell : '']; // Only add if not empty

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Remove any <hr> elements that are direct children of the same parent as heroRoot
  const parent = heroRoot.parentElement;
  if (parent) {
    Array.from(parent.children).forEach(child => {
      if (child.tagName === 'HR') {
        child.remove();
      }
    });
  }

  // Replace the hero block with the table
  heroRoot.replaceWith(table);
}
