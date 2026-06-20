// Computed once at module level — never recalculates on re-render
const CURRENT_YEAR = new Date().getFullYear();
import { CreatorLogo } from './CreatorLogo';

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
          <CreatorLogo
            className="footer-logo"
            width="40"
            height="40"
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
              alt="Jooble Job Search Engine"
              className="footer-api-favicon"
              loading="lazy"
              width="16"
              height="16"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="footer-api-name">Jooble</span>
          </a>
        </div>

      </div>
    </footer>
  );
};
