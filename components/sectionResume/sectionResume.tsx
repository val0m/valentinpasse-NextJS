// Libs
import React from 'react';
import Image from 'next/image';

// Images
import Profile from '../../public/images/resume/valentin-passe.webp';

// CSS Module
import styles from "./sectionResume.module.scss"

export function SectionResume () {
  return (
    
    <section id="resume" className="content-section text-center">
        <div className="resume-section">
            <div className="resume-container">
                <h2>A propos de moi</h2>

                <div className="row resume-complete">
                    <div className="col-sm-3 information-container">
                        <div className="resume-img">
                          <Image src={Profile} height={200} alt="Image Valentin PASSE"></Image>
                        </div>
                    </div>
                    <div className="col-sm-7 personnal-container">
                        <div className="resume-personnal">
                            <span className="hidden-lg hidden-md hidden-sm separator"></span>
                              Ayant acquis précédemment plusieurs expériences dans le développement web, je possède de véritables atouts pour la programmation. Je suis autodidacte, autonome et je dispose d’un bon sens du travail en équipe.<br /><br />
                              Rigoureux et méthodique, je suis passionné de nouvelles technologies, ce qui me permet de rester à jour sur les dernières nouveautés pour en apprendre davantage et proposer mes meilleurs services.<br /><br />
                              Je reste à votre disposition si mon profil vous intéresse grâce à la section <a href="#contact">Contact</a>.
                            <span className="hidden-lg hidden-md hidden-sm separator"></span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}