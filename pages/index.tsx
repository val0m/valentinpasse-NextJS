// Libs
// import Head from 'next/head'
// import Image from 'next/image'

// Components
import { Layout } from "../components/layout/layout";
import { Hr } from "../components/hr/hr";
import { SectionResume } from "../components/sectionResume/sectionResume";
import { SectionSkills } from "../components/sectionSkills/sectionSkills";
import { SectionWorkExperiences } from "../components/sectionWorkExperiences/sectionWorkExperiences";
import { SectionEducations } from "../components/sectionEducations/sectionEducations";
import { SectionProjects } from "../components/sectionProjects/sectionProjects";

//CSS Module
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Développeur Full stack <a href="https://nextjs.org">.NET</a>
          </h1>

          <p className={styles.description}>
            Portfolio de <code className={styles.code}>Valentin PASSE</code>
          </p>

          <Hr />
          <SectionResume />
          <Hr />
          <SectionSkills />
          <Hr />
          <SectionWorkExperiences />
          <Hr />
          <SectionEducations />
          <Hr />
          <SectionProjects />
          <Hr />
        </main>
      </div>
    </Layout>
  );
}
