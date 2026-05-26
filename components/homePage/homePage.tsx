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
      <main className={styles.page}>
        <HeroSection locale={locale} />
        <div className={styles.container}>
          <div className={styles.stack}>
            <SectionResume locale={locale} />
            <Hr />
            <SectionServices locale={locale} />
            <Hr />
            <SectionSkills locale={locale} />
            <Hr />
            <SectionWorkExperiences locale={locale} />
            <Hr />
            <SectionEducations locale={locale} />
            <Hr />
            <SectionProjects locale={locale} />
          </div>
        </div>
        <SectionContact locale={locale} />
      </main>
    </Layout>
  );
}