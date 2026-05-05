export function generateSite(template, customizations) {
  let html = template.html;
  let css = template.css;

  template.fields.forEach(field => {
    const value = customizations[field.id] !== undefined ? customizations[field.id] : (field.default || '');
    const regex = new RegExp(`{{${field.id}}}`, 'g');

    if (field.type === 'image') {
      html = html.replace(regex, value);
    } else if (field.type === 'color') {
      css = css.replace(regex, value);
      html = html.replace(regex, value);
    } else {
      html = html.replace(regex, escapeHtml(value));
    }
  });

  // Replace any remaining placeholders with defaults
  template.fields.forEach(field => {
    const regex = new RegExp(`{{${field.id}}}`, 'g');
    const defaultValue = field.default || '';
    if (field.type === 'text') {
      html = html.replace(regex, escapeHtml(defaultValue));
    } else {
      html = html.replace(regex, defaultValue);
      css = css.replace(regex, defaultValue);
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(customizations.title || template.name)}</title>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
