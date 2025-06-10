// src/components/Preview.js
import React, { useEffect, useState } from 'react';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default function Preview({ sdk }) {
  const [html, setHtml] = useState('<p>Loading preview …</p>');

  useEffect(() => {
    (async () => {
      try {
        const entryId = sdk.entry.getSys().id;
        const contentTypeId = sdk.entry.getSys().contentType.sys.id;
        const isHIPAA = contentTypeId === 'hipaaLibraryPage';

        const sectionType       = isHIPAA ? 'hipaaLibraryPageSection' : 'libraryPageSection';
        const sectionTitleField = isHIPAA ? 'sectionId'              : 'sectionId';
        const parentField       = 'parent';
        const locale            = sdk.locales.default;

        const { items } = await sdk.space.getEntries({
          content_type: sectionType,
          [`fields.${parentField}.sys.id`]: entryId,
          order: 'fields.sortOrder',
        });

        if (!items.length) {
          setHtml('<p><em>No sections found.</em></p>');
          return;
        }

        const out = items
          .map((it) => {
            const title = it.fields?.[sectionTitleField]?.[locale] ?? '(Untitled)';
            const body  = it.fields?.body?.[locale];
            return `<h3>${title}</h3>${body ? documentToHtmlString(body) : '<em>No content</em>'}`;
          })
          .join('');

        setHtml(out);
      } catch (err) {
        console.error(err);
        setHtml('<p style="color:red;">Error loading sections.</p>');
      }
    })();
  }, [sdk]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}