// Libs
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Images
import Logo from '../../public/images/header/logo.webp';

// CSS Module
import styles from "./HeaderCustom.module.scss"

export function HeaderCustom () {
  interface Item {
    label: string;
    route: string;
  }

  const items: Item[] = [
    {
      label: 'A propos de moi',
      route: '#Resume',
    },
    {
      label: 'Compétences',
      route: '#Skills',
    },
    {
      label: 'Expériences professionnelles',
      route: '#WorkExperience',
    },
    {
      label: 'Apprentissages',
      route: '#Educations',
    },
    {
      label: 'Projets',
      route: '#Projects',
    },
    {
      label: 'Contact',
      route: '#Contact',
    },
  ];

  const router = useRouter();
  function getSelectedCss(currentRoute: string): string {
    return currentRoute === router.route ? 'selected' : '';
  }

  function forceMenuToClosed(): void {
    var navbarContent = document.getElementById('menuValentinPasse');
    if (navbarContent) {
      if (navbarContent.classList.contains('show')) {
        navbarContent.classList.remove('show');
      }
    }
    var navbarContent = document.getElementById('togglerMenuValentinPasse');
    if (navbarContent) {
      if (!navbarContent.classList.contains('collapsed')) {
        navbarContent.classList.add('collapsed');
      }
      if (navbarContent.hasAttribute('aria-expanded')) {
        navbarContent.setAttribute('aria-expanded', 'false');
      }
    }
  }

  return (
    <header>
      <nav className="navbar sticky-top navbar-expand-md bg-white border-bottom">
        <div className="container-fluid">
          <Link href="/" className="nav-brand d-flex">
              <Image src={Logo} width={50} height={60} alt="Logo Valentin PASSE"></Image>
              <span className="align-self-center h5 ps-2 mb-0"><b>VALENTIN</b> PASSE</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuValentinPasse" aria-controls="menuValentinPasse" aria-expanded="false" aria-label="Toggle navigation" id="togglerMenuValentinPasse">
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="menuValentinPasse">
            <ul className="navbar-nav ms-auto text-center mr-2">
              {items.map((i) => (
                <li className="nav-item my-auto" onClick={forceMenuToClosed} key={i.label}>
                  <Link href={i.route} className={`nav-link ${getSelectedCss(i.route)}`}>
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
  }