import React from "react";

/**
 * Parse event description to convert URLs to links and handle HTML content
 */
export function parseDescription(description: string | null | undefined): { __html: string } | (string | React.ReactElement)[] | string | null {
  if (!description) return null;

  // Check if description contains HTML
  const hasHTML = /<[a-z][\s\S]*>/i.test(description);

  if (hasHTML) {
    // Process HTML content: ensure all links have target="_blank" and rel="noopener noreferrer"
    let processedHTML = description;

    // Update existing <a> tags to ensure they open in new tabs
    processedHTML = processedHTML.replace(
      /<a\s+([^>]*?)>/gi,
      (match, attributes) => {
        // Check if target and rel are already present
        const hasTarget = /target\s*=/i.test(attributes);
        const hasRel = /rel\s*=/i.test(attributes);

        let newAttributes = attributes;

        if (!hasTarget) {
          newAttributes += ' target="_blank"';
        } else {
          newAttributes = newAttributes.replace(
            /target\s*=\s*["']?([^"'\s>]+)["']?/gi,
            'target="_blank"'
          );
        }

        if (!hasRel) {
          newAttributes += ' rel="noopener noreferrer"';
        } else {
          newAttributes = newAttributes.replace(
            /rel\s*=\s*["']?([^"'\s>]+)["']?/gi,
            (relMatch: string, relValue: string) => {
              const relParts = relValue.split(/\s+/);
              if (!relParts.includes('noopener')) relParts.push('noopener');
              if (!relParts.includes('noreferrer')) relParts.push('noreferrer');
              return `rel="${relParts.join(' ')}"`;
            }
          );
        }

        // Add styling class if not present
        if (!/class\s*=/i.test(newAttributes)) {
          newAttributes += ' class="text-link-blue underline break-all"';
        } else {
          // Add break-all class to existing class
          newAttributes = newAttributes.replace(
            /class\s*=\s*["']([^"']+)["']/gi,
            (classMatch: string, classValue: string) => {
              const classes = classValue.split(/\s+/);
              if (!classes.includes('break-all')) classes.push('break-all');
              if (!classes.includes('underline')) classes.push('underline');
              return `class="${classes.join(' ')}"`;
            }
          );
        }

        return `<a ${newAttributes}>`;
      }
    );

    // Also find plain text URLs that are not already inside <a> tags and convert them to links
    // We need to process text nodes that are outside of HTML tags
    // Strategy: split by HTML tags, process text parts, then reassemble
    const htmlTagRegex = /<[^>]+>/g;
    const parts: Array<{ text: string; isHTML: boolean }> = [];
    let lastIndex = 0;
    let tagMatch;

    while ((tagMatch = htmlTagRegex.exec(processedHTML)) !== null) {
      // Add text before tag
      if (tagMatch.index > lastIndex) {
        const textBefore = processedHTML.substring(lastIndex, tagMatch.index);
        if (textBefore.trim()) {
          parts.push({ text: textBefore, isHTML: false });
        }
      }
      // Add HTML tag
      parts.push({ text: tagMatch[0], isHTML: true });
      lastIndex = tagMatch.index + tagMatch[0].length;
    }

    // Add remaining text
    if (lastIndex < processedHTML.length) {
      const textAfter = processedHTML.substring(lastIndex);
      if (textAfter.trim()) {
        parts.push({ text: textAfter, isHTML: false });
      }
    }

    // Process text parts to convert URLs to links
    const finalParts: string[] = [];

    parts.forEach((part) => {
      if (part.isHTML) {
        finalParts.push(part.text);
      } else {
        // Convert URLs in text to HTML links
        const text = part.text;
        const urlMatches: Array<{ index: number; url: string }> = [];

        // Collect all URL matches (reset regex for each text part)
        const textUrlRegex = /(https?:\/\/[^\s<>"']+)/gi;
        let urlMatch;
        while ((urlMatch = textUrlRegex.exec(text)) !== null) {
          urlMatches.push({
            index: urlMatch.index,
            url: urlMatch[0],
          });
        }

        // Build HTML string with URLs converted to links
        let processedText = '';
        let currentIndex = 0;

        urlMatches.forEach((urlMatch) => {
          // Add text before URL
          processedText += text.substring(currentIndex, urlMatch.index);
          // Add link for URL
          processedText += `<a href="${urlMatch.url}" target="_blank" rel="noopener noreferrer" class="text-link-blue underline break-all" style="word-break: break-all;">${urlMatch.url}</a>`;
          currentIndex = urlMatch.index + urlMatch.url.length;
        });

        // Add remaining text
        processedText += text.substring(currentIndex);
        finalParts.push(processedText);
      }
    });

    return { __html: finalParts.join('') };
  } else {
    // Plain text - convert URLs to links
    const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = urlRegex.exec(description)) !== null) {
      // Add text before URL
      if (match.index > lastIndex) {
        parts.push(description.substring(lastIndex, match.index));
      }

      // Add link for URL
      const url = match[0];
      parts.push(
        React.createElement(
          'a',
          {
            key: `url-${keyCounter++}`,
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-link-blue underline break-all',
            style: { wordBreak: 'break-all' },
          },
          url
        )
      );

      lastIndex = match.index + url.length;
    }

    // Add remaining text
    if (lastIndex < description.length) {
      parts.push(description.substring(lastIndex));
    }

    return parts.length > 0 ? parts : description;
  }
}

