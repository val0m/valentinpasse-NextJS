// Libs
import type { AppProps } from 'next/app'

// Components
// import Layout from '../components/layout/Layout';
import { useEffect } from 'react';

//CSS Module
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require('../node_modules/bootstrap/dist/js/bootstrap.bundle.js');
  }, []);

  return <Component {...pageProps} />
}

// export default function App({ Component, pageProps }: AppProps) {
// useEffect(() => {
//   require('../node_modules/bootstrap/dist/js/bootstrap.bundle.js');
// }, []);

//   return (
//     <>
//       <Layout>
//           <Component {...pageProps} />
//       </Layout>
//     </>
//   );
// }
