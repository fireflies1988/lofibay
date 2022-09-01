import React from "react";
import { Link } from "react-router-dom";
import { FooterStyles } from "./styles/Footer.styled";

function Footer() {
  return (
    <FooterStyles>
      <div className="footer__container">
        <div className="footer__content" style={{ marginTop: "18px" }}>
          <Link to="#" className="footer__brand">
            Lofibay
          </Link>
          <span className="footer__description">
            The best free stock photos
          </span>
          <div>
            <Link to="#" className="footer__social">
              <i className="bx bxl-facebook"></i>
            </Link>
            <Link to="#" className="footer__social">
              <i className="bx bxl-instagram"></i>
            </Link>
            <Link to="#" className="footer__social">
              <i className="bx bxl-twitter"></i>
            </Link>
          </div>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Information</h3>
          <ul>
            <li>
              <Link to="#" className="footer__link">
                About
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Blog
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Become a hero
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Image and Video API
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Free Stock Photos</h3>
          <ul>
            <li>
              <Link to="#" className="footer__link">
                Popular Search
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Black and White Photography
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Happy Birthday Images
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Free Business Videos
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Cool Wallpaper
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Best HD Wallpapers
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Wallpapers</h3>
          <ul>
            <li>
              <Link to="#" className="footer__link">
                Galaxy Wallpaper
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Lock Screen Wallpaper
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                4K Wallpaper
              </Link>
            </li>
            <li>
              <Link to="#" className="footer__link">
                Mobile Wallpaper
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="footer__copy">&#169; 2022 Lofibay. All right reserved</p>
      <p className="footer__copy" style={{ marginTop: 0 }}>Kieu Huynh Thanh Tung</p>
    </FooterStyles>
  );
}

export default Footer;
