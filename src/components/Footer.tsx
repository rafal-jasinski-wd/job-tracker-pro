// Computed once at module level — never recalculates on re-render
const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Left: Copyright */}
        <div>
          <p className="footer-copyright-name">JobTrackr Pro</p>
          <p className="footer-copyright-year">© {CURRENT_YEAR} All rights reserved.</p>
        </div>

        {/* Center: Created by + Logo */}
        <div className="footer-creator">
          <span className="footer-creator-text">Created by</span>
          <img
            src="/creator-logo.webp"
            alt="Creator Logo"
            className="footer-logo"
            loading="lazy"
          />
        </div>

        {/* Right: API Provider Credit */}
        <div className="footer-powered">
          <span className="footer-powered-text">Job data powered by</span>
          <a
            href="https://jooble.org"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-api-link"
          >
            <img
              src="https://jooble.org/favicon.ico"
              alt="Jooble"
              className="footer-api-favicon"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="footer-api-name">Jooble</span>
          </a>
        </div>

      </div>
    </footer>
  );
};
