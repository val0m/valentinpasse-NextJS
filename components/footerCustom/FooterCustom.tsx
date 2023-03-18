// Libs
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Images
import LogoHeader from '../../public/images/header/logo.webp';

// CSS Module
import styles from "./FooterCustom.module.scss"
// import { fontWeight } from '@mui/system';


export function FooterCustom () {
    
    return (
        <footer className="container border-top">
          <div className="d-flex flex-column align-items-center">
            <Link href="/">
                <Image src={LogoHeader} width="160" height="200" alt="Logo du portfolio de Valentin PASSE"></Image>
            </Link>
            <p>Développeur Web spécialisé dans la technologie Microsoft</p>
            <p className="text-muted">
              <small>© 2023 - Portfolio de Valentin PASSE, tous droits réservés.</small>
            </p>
          </div>
        </footer>
    );
  }