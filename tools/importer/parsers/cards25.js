/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info (image, name, role, socials)
  function extractCard(section) {
    // Image
    const img = section.querySelector('.image img');
    // Gather all heading/content bits for the card text cell, in order
    const textBits = [];
    // Get all .cmp-title__text (should be h3, h5) in DOM order for name and role
    section.querySelectorAll('.cmp-title__text').forEach(el => {
      textBits.push(el);
    });
    // Social buttons block
    const socials = section.querySelector('.buildingblock');
    if (socials) textBits.push(socials);
    if (img && textBits.length) {
      return [img, textBits];
    }
    return null;
  }
  // All card sections in DOM order
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  if (!cardSections.length) return;
  // Table rows
  const rows = [['Cards (cards25)']];
  cardSections.forEach(section => {
    const row = extractCard(section);
    if (row) rows.push(row);
  });
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
