import { getTranslations } from 'next-intl/server';

interface LegalPageProps {
  /** Top-level i18n namespace (e.g. "privacyPolicy"). */
  namespace: string;
  /** Ordered list of section keys under `<namespace>.sections`. */
  sectionKeys: readonly string[];
  /** Current locale (passed from the page server component). */
  locale: string;
}

interface Section {
  heading: string;
  body: string[];
  items?: string[];
}

/**
 * Plain legal-document layout: title, last-updated stamp, disclaimer
 * callout, intro paragraph, then an ordered list of sections each with
 * a heading, body paragraphs, and optional bulleted items.
 */
export async function LegalPage({
  namespace,
  sectionKeys,
  locale,
}: LegalPageProps) {
  const t = await getTranslations({ locale, namespace });

  const sections: Array<{ key: string; section: Section }> = sectionKeys.map(
    (key) => ({
      key,
      section: {
        heading: t(`sections.${key}.heading`),
        body: t.raw(`sections.${key}.body`) as string[],
        items: (() => {
          try {
            const raw = t.raw(`sections.${key}.items`);
            return Array.isArray(raw) ? (raw as string[]) : undefined;
          } catch {
            return undefined;
          }
        })(),
      },
    }),
  );

  return (
    <article className="font-sans min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <header className="mb-10">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('lastUpdated')}
          </p>
        </header>

        <aside
          className="mb-10 rounded-lg border border-[#C62828]/30 bg-[#C62828]/5 px-5 py-4 text-sm text-foreground/80"
          role="note"
        >
          <strong className="font-semibold text-[#C62828]">Disclaimer: </strong>
          {t('disclaimer')}
        </aside>

        <p className="text-base leading-relaxed text-foreground/90 mb-12">
          {t('intro')}
        </p>

        <div className="space-y-10">
          {sections.map(({ key, section }) => (
            <section key={key}>
              <h2
                className="text-xl md:text-2xl font-semibold text-foreground mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {section.heading}
              </h2>
              <div className="space-y-3 text-base leading-relaxed text-foreground/90">
                {section.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {section.items && section.items.length > 0 && (
                <ul className="mt-4 ml-5 list-disc space-y-2 text-base leading-relaxed text-foreground/90 marker:text-[#C62828]">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
