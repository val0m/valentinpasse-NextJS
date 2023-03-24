// Libs
// import Head from 'next/head'
// import Image from 'next/image'

// Components
import Layout from '../components/layout/Layout';
import { SectionResume } from '../components/sectionResume/SectionResume';
import { SectionSkills } from '../components/sectionSkills/SectionSkills';
import { SectionWorkExperiences } from '../components/sectionWorkExperiences/SectionWorkExperiences';
import { SectionEducations } from '../components/sectionEducations/SectionEducations';
import { SectionProjects } from '../components/sectionProjects/SectionProjects';

//CSS Module
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Développeur Full stack <a href="https://nextjs.org">.NET</a>
          </h1>

          <p className={styles.description}>
            Portfolio de {' '}
            <code className={styles.code}>Valentin PASSÉ</code>
          </p>

          <SectionResume />

          <SectionSkills />

          <SectionWorkExperiences />

          <SectionEducations />

          <SectionProjects />
         
        </main>

      </div>
    </Layout>
  )
}
