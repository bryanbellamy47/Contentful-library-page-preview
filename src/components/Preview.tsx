import React, { useEffect, useState } from 'react';
import type { FieldAppSDK } from '@contentful/app-sdk';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { GlobalStyles } from '@contentful/f36-components';

type Section = { title: string; bodyHtml: string };
type PreviewProps = { sdk: FieldAppSDK };

export default function Preview({ sdk }: PreviewProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sdk.window?.startAutoResizer();
  }, [sdk]);

  useEffect(() => {
    (async () => {
      try {
        const sys = sdk.entry.getSys();
        const contentTypeId = sys.contentType.sys.id;

        const isPage =
          contentTypeId === 'hipaaLibraryPage' || contentTypeId === 'libraryPage';
        const isSection =
          contentTypeId === 'hipaaLibraryPageSection' ||
          contentTypeId === 'libraryPageSection';

        if (!isPage && !isSection) {
          setSections([]);
          return;
        }

        const isHIPAA = contentTypeId.startsWith('hipaa');

        const sectionType = isHIPAA
          ? 'hipaaLibraryPageSection'
          : 'libraryPageSection';
        const sectionTitleField = isHIPAA ? 'sectionId' : 'title';
        const parentField = 'parent';
        const locale = sdk.locales.default;

        const pageId = isSection
          ? sdk.entry.fields[parentField]?.getValue()?.sys?.id
          : sys.id;

        if (!pageId) {
          setError('No parent page set for this section.');
          return;
        }

        const { items } = await sdk.space.getEntries({
          content_type: sectionType,
          [`fields.${parentField}.sys.id`]: pageId,
          order: 'fields.sortOrder',
        });

        if (!items.length) {
          setSections([]);
          return;
        }

        setSections(
          items.map((it: any) => ({
            title: it.fields?.[sectionTitleField]?.[locale] ?? '(Untitled)',
            bodyHtml: it.fields?.body?.[locale]
              ? documentToHtmlString(it.fields.body[locale])
              : '<em>No content</em>',
          }))
        );
      } catch (e) {
        console.error(e);
        setError('Sorry – I couldn\'t load the sections.');
      }
    })();
  }, [sdk]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!sections.length)
    return <p style={{ fontStyle: 'italic' }}>No sections found.</p>;

  return (
    <>
      {/* F36 resets & tokens -> gives you that "native" look */}
      <GlobalStyles />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sections.map(({ title, bodyHtml }, idx) => (
          <div key={idx} className="section-card">
            <h3>{title}</h3>

            <div
              style={{ lineHeight: 1.6, fontSize: '0.9rem' }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
