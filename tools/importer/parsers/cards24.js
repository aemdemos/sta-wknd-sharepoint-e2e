/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const rows = [['Cards (cards24)']];

  // Find all the relevant section info: headings + intros, preserve structure
  // We'll scan for .cmp-title--underline (section headings) and the next .cmp-text (intro) after it
  const allSections = [];
  const children = Array.from(element.children);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (
      child.classList &&
      child.classList.contains('title') &&
      child.classList.contains('cmp-title--underline')
    ) {
      // Section heading
      const heading = child.querySelector('.cmp-title__text');
      if (heading) allSections.push([heading]);
      // Look for intro directly after
      const next = children[i + 1];
      if (
        next &&
        next.classList &&
        next.classList.contains('text') &&
        next.querySelector('.cmp-text')
      ) {
        const intro = next.querySelector('.cmp-text');
        if (intro) allSections.push([intro]);
        i++; // skip next
      }
    }
  }
  // Insert all section headings and intros as single-column rows
  allSections.forEach(row => rows.push(row));

  // Process all card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment'));
  cardSections.forEach(section => {
    // First column: Image
    const img = section.querySelector('img');
    // Second column: All text content
    const textContent = [];
    section.querySelectorAll('h3, h5').forEach(h => textContent.push(h));
    section.querySelectorAll('p').forEach(p => textContent.push(p));
    const socialLinks = section.querySelectorAll('a.cmp-button');
    if (socialLinks.length) {
      const linksDiv = document.createElement('div');
      socialLinks.forEach(link => linksDiv.appendChild(link));
      textContent.push(linksDiv);
    }
    rows.push([img, textContent]);
  });

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
