// Libs
import React from 'react';

// Images

// CSS Module
import styles from "./SectionSkills.module.scss"

// Data
import skillsData from "../../public/data/skills.json";
import { json } from 'stream/consumers';

export function SectionSkills () {
  interface Skill {
    label: string;
    description: string;
    category: SkillCategory;
    position: number;
  }

  enum SkillCategory {
    Technlology = "Technologie Microsoft",
    Database = "Base de donnée",
    Other = "Autre",
    Software = "Logiciel",
    OperatingSystem = "Système d'exploitation",
    Qualification = "Compétence"
  }

//   const skills: Array<Skill> = JSON.parse(skillsData); // converrt to skill
  const skills = skillsData;
  const categories = Object.values(SkillCategory);

  return (
    <section id="skills" className="content-section text-center">
        <div className='skills-section'>
            <div className='skills-container'>
                <h2>Skills</h2>
                <div className="row pr-2">
                          
                    {categories.map((value, index) => {
                    return (
                        <div key={index} className="col-md-4 col-sm-6 col-xs-12">
                            <div className="bloc-title-skills">
                                <div className="title-skills"><span className="label label-primary">{value}</span></div>
                            </div>
                            {skillsData.filter((item) => item.category == value).map((skill, indexSkill) => {
                            return (      
                                <div key={indexSkill}>                
                                    <span className="label-progress">{skill.label}</span>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped active" role="progressbar" style={{width:'90%'}}>
                                            90%
                                            <span className="sr-only">90% Complete</span>
                                        </div>
                                    </div> 
                                    {/* <div className="progress">
                                        <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
                                            90%
                                            <span className="sr-only">90% Complete</span>
                                        </div>
                                    </div> */}
                                </div>          
                            )})}
                        </div>
                    )})}
                </div>
            </div>
        </div>
        {/* <div className="skills-section">
            <div className="skills-container">
                <h2>Skills</h2>
                <div className="row pr-2">
                    <div className="col-md-4 col-sm-6 col-xs-12">
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-primary">Technology</span></div>
                        </div>
                        <span className="label-progress">Microsoft .NET</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">AJAX</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">SSIS</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                70%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-primary">language</span></div>
                        </div>
                        <span className="label-progress">HTML5</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">CSS3</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">JavaScript</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 85%">
                                85%
                                <span className="sr-only">85% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">PHP</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
                                60%
                                <span className="sr-only">60% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">ASP.NET</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">SQL</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">C#</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Java</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%">
                                50%
                                <span className="sr-only">50% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">XML</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">JSON</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
    
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-12">
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-info">Operating systems</span></div>
                        </div>
                        <span className="label-progress">Windows XP, Vista, 7, 8, 10</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Mac OS X</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%">
                                75%
                                <span className="sr-only">75% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Linux</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%">
                                50%
                                <span className="sr-only">50% Complete</span>
                            </div>
                        </div>
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-danger">Database</span></div>
                        </div>
                        <span className="label-progress">SQL server</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Oracle</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%">
                                70%
                                <span className="sr-only">70% Complete (warning)</span>
                            </div>
                        </div>
                        <span className="label-progress">MySQL</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                                80%
                                <span className="sr-only">80% Complete</span>
                            </div>
                        </div>
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-warning">IDE &amp; Text Editor</span></div>
                        </div>
                        <span className="label-progress">VS 2010, 2012, 2013</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Adobe Dreamweaver</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%">
                                70%
                                <span className="sr-only">70% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">PhpStorm</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
                                60%
                                <span className="sr-only">60% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Eclipse</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
                                60%
                                <span className="sr-only">60% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Sublime Text 2</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 85%">
                                85%
                                <span className="sr-only">85% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Notepad ++</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                    <div className="col-md-4 col-sm-6 col-xs-12">
                        <!-- Bloc Office software -->
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-success">Office software</span></div>
                        </div>
                        <span className="label-progress">Team Foundation Server (TFS)</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width: 85%">
                                85%
                                <span className="sr-only">85% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Microsoft Office</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">iWorks (Mac)</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
                                90%
                                <span className="sr-only">90% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Adobe Photoshop</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                                80%
                                <span className="sr-only">80% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">Adobe InDesign</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%">
                                70%
                                <span className="sr-only">70% Complete</span>
                            </div>
                        </div>
                        <div className="bloc-title-skills">
                            <div className="title-skills"><span className="label label-grey">qualifications</span></div>
                        </div>
                        <span className="label-progress">team spirit</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-grey progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">self-educated</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-grey progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">dynamic</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-grey progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">methodical</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-grey progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                        <span className="label-progress">autonomous</span>
                        <div className="progress">
                            <div className="progress-bar progress-bar-grey progress-bar-striped active" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%">
                                95%
                                <span className="sr-only">95% Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        </div> */}
    </section>
  );
}