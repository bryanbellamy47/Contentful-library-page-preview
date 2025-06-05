// src/components/Preview.tsx
import React, { useEffect, useState } from 'react';
import type { FieldAppSDK } from '@contentful/app-sdk';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import {
  GlobalStyles,
  Card,
  Heading,
  Text,
  Stack,
  Box,
} from '@contentful/f36-components';

type Section = { title: string; bodyHtml: string };
type PreviewProps = { sdk: FieldAppSDK };

export default function Preview({ sdk }: PreviewProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ─────────────────────────────  auto-resize  ───────────────────────────── */
  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  /* ─────────────────────────────  load data  ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const entryId       = sdk.entry.getSys().id;
        const contentTypeId = sdk.entry.getSys().contentType.sys.id;
        const isHIPAA       = contentTypeId === 'hipaaLibraryPage';

        const sectionType       = isHIPAA ? 'hipaaLibraryPageSection' : 'libraryPageSection';
        const sectionTitleField = isHIPAA ? 'sectionId'              : 'title';
        const parentField       = 'parent';
        const locale            = sdk.locales.default;

        const { items } = await sdk.space.getEntries({
          content_type: sectionType,
          [`fields.${parentField}.sys.id`]: entryId,
          order: 'fields.sortOrder',
        });

        if (!items.length) {
          setSections([]);
          return;
        }

        setSections(
          items.map((it: any) => ({
            title:
              it.fields?.[sectionTitleField]?.[locale] ?? '(Untitled)',
            bodyHtml:
              it.fields?.body?.[locale]
                ? documentToHtmlString(it.fields.body[locale])
                : '<em>No content</em>',
          }))
        );
      } catch (e) {
        console.error(e);
        setError('Sorry – I couldn’t load the sections.');
      }
    })();
  }, [sdk]);

  /* ─────────────────────────────  render  ────────────────────────────────── */
  if (error) return <Text tone="negative">{error}</Text>;
  if (!sections.length)
    return <Text fontStyle="italic">No sections found.</Text>;

  return (
    <>
      {/* F36 resets & tokens → gives you that “native” look */}
      <GlobalStyles />

      <Stack flexDirection="column" gap="spacingL">
        {sections.map(({ title, bodyHtml }, idx) => (
          <Card
            key={idx}
            padding="spacingL"
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Heading as="h3" marginBottom="spacingM">
              {title}
            </Heading>

            <Box
              as="div"
              style={{ lineHeight: 1.6, fontSize: '0.9rem' }}
              /* safe because the HTML comes from Contentful’s renderer           */
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </Card>
        ))}
      </Stack>
    </>
  );
}