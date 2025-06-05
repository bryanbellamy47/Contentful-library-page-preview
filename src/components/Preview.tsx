// src/components/Preview.tsx
import React, { useEffect, useState } from 'react';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { FieldAppSDK } from '@contentful/app-sdk';

type PreviewProps = { sdk: FieldAppSDK };

export default function Preview({ sdk }: PreviewProps) {
  const [html, setHtml] = useState('<p>Loading preview …</p>');

  /** 1️⃣  Autosize on mount */
  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  /** 2️⃣  Fetch & render */
  useEffect(() => {
    (async () => {
      try {
        const entrySys       = sdk.entry.getSys();
        const entryId        = entrySys.id;
        const contentTypeId  = entrySys.contentType.sys.id;
        const isHIPAA        = contentTypeId === 'hipaaLibraryPage';

        const sectionType       = isHIPAA ? 'hipaaLibraryPageSection' : 'libraryPageSection';
        const sectionTitleField = isHIPAA ? 'sectionId'              : 'title';
        const parentField       = 'parent';
        const locale            = sdk.locales.default;

        const { items } = await sdk.space.getEntries({
          content_type: sectionType,
          [`fields.${parentField}.sys.id`]: entryId,
          order: 'fields.sortOrder'
        });

        if (!items.length) {
          setHtml('<p><em>No sections found.</em></p>');
          return;
        }

        const markup = items
          .map(item => {
            const fields = item.fields as any;
            const title  = fields?.[sectionTitleField]?.[locale] ?? '(Untitled)';
            const body   = fields?.body?.[locale];
            return `
              <div class="section-card">
                <h3>${title}</h3>
                ${body ? documentToHtmlString(body) : '<em>No content</em>'}
              </div>`;
          })
          .join('');

        setHtml(markup);
      } catch (err) {
        console.error(err);
        setHtml('<p style="color:red;">Error loading sections.</p>');
      }
    })();
  }, [sdk]);

  /** 3️⃣  Exact height poke after every paint */
  useEffect(() => {
    // wait a tick so DOM is flushed
    const id = setTimeout(() => {
      const h = document.body.scrollHeight;
      sdk.window.updateHeight(h);
    }, 0);
    return () => clearTimeout(id);
  }, [html, sdk]);

  return (
    <div
      className="preview-root"
      style={{ padding: '1rem' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}