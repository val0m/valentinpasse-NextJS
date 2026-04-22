// Libs
// import Head from 'next/head'
// import Image from 'next/image'

// Components
import { Layout } from "../components/layout";
import { Hr } from "../components/hr";
import { HeroSection } from "../components/heroSection";
import { SectionContact } from "../components/sectionContact";
import { SectionResume } from "../components/sectionResume";
import { SectionServices } from "../components/sectionServices";
import { SectionSkills } from "../components/sectionSkills";
import { SectionWorkExperiences } from "../components/sectionWorkExperiences";
import { SectionEducations } from "../components/sectionEducations";
import { SectionProjects } from "../components/sectionProjects";

//CSS Module
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <Layout>
      <main>
        <HeroSection />
        <div className={styles.container}>
          <div className={styles.main}>
            <SectionResume />
            <Hr />
            <SectionServices />
            <Hr />
            <SectionSkills />
            <Hr />
            <SectionWorkExperiences />
            <Hr />
            <SectionEducations />
            <Hr />
            <SectionProjects />
            <Hr />
          </div>
        </div>
        <SectionContact />
      </main>
    </Layout>
  );
}
