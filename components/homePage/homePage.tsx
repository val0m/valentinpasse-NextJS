import React from "react";
import { Layout } from "../layout";
import { Hr } from "../hr";
import { HeroSection } from "../heroSection";
import { SectionContact } from "../sectionContact";
import { SectionResume } from "../sectionResume";
import { SectionServices } from "../sectionServices";
import { SectionSkills } from "../sectionSkills";
import { SectionWorkExperiences } from "../sectionWorkExperiences";
import { SectionEducations } from "../sectionEducations";
import { SectionProjects } from "../sectionProjects";
import { RevealOnScroll } from "../revealOnScroll";
import { PortfolioLocale, getPortfolioContent } from "../../content/portfolioContent";
import styles from "../../styles/Home.module.css";

type HomePageProps = {
  locale: PortfolioLocale;
};

export function HomePage({ locale }: HomePageProps) {
  const content = React.useMemo(() => getPortfolioContent(locale), [locale]);
  const canonicalPath = locale === "en" ? "/en" : "/";

  return (
    <Layout
      locale={locale}
      title={content.meta.title}
      description={content.meta.description}
      canonicalPath={canonicalPath}
    >
      <main id="main-content" className={styles.page}>
        {/* The hero owns its own entrance/parallax motion; every other section
            reveals on scroll via RevealOnScroll for a coherent, restrained feel. */}
        <HeroSection locale={locale} />
        <div className={styles.container}>
          <div className={styles.stack}>
            <RevealOnScroll>
              <SectionResume locale={locale} />
            </RevealOnScroll>
            <Hr />
            <RevealOnScroll>
              <SectionServices locale={locale} />
            </RevealOnScroll>
            <Hr />
            <RevealOnScroll>
              <SectionSkills locale={locale} />
            </RevealOnScroll>
            <Hr />
            <RevealOnScroll>
              <SectionWorkExperiences locale={locale} />
            </RevealOnScroll>
            <Hr />
            <RevealOnScroll>
              <SectionEducations locale={locale} />
            </RevealOnScroll>
            <Hr />
            <RevealOnScroll>
              <SectionProjects locale={locale} />
            </RevealOnScroll>
          </div>
        </div>
        <RevealOnScroll>
          <SectionContact locale={locale} />
        </RevealOnScroll>
      </main>
    </Layout>
  );
}