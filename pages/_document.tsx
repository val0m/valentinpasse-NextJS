import Document, { Head, Html, Main, NextScript, DocumentContext } from "next/document";

type PortfolioDocumentProps = {
  locale: "fr" | "en";
};

class PortfolioDocument extends Document<PortfolioDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const locale = ctx.pathname.startsWith("/en") ? "en" : "fr";

    return {
      ...initialProps,
      locale,
    };
  }

  render() {
    const locale = this.props.locale || "fr";

    return (
      <Html lang={locale}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default PortfolioDocument;