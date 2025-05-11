import React from "react";
import Logo from "../../assets/logo.png"
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const FooterLinks = [
  { title: "Home", link: "/#" },
  { title: "About", link: "/#about" },
  { title: "Contact", link: "/#contact" },
  { title: "Blog", link: "/#blog" }
];const Footer = () => {
  return (
    <>
      <div>
        <div className="container grid md:grid-cols-3 pb-20 pt-5">
          <div className="py-8 px-4">
            <img src={Logo} alt="" className="w-36" />  
            <div className="space-y-5">
              <p className="pt-4 opacity-60">
                This template provides a minimal setup to get React working
                in Vite with HMR and some ESLint rules.
              </p>
              <div>
                <button
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="primary-btn">
                  Visit Youtube
                </button>
              </div>
            </div>
          </div>
          {/* {footer} */}

          <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
            <div className="py-8 px-4">
              <h1 className="text-xl font-semibold sm:text-left mb-5">Import Link</h1>
              <ul className="space-y-5">
                {
                  FooterLinks.map((map) => (
                    <li key={map.id}>
                      <a href={map.link}>{map.title}</a>
                    </li>
                  ))
                }
              </ul>
            </div>
            <div className="py-8 px-4">
              <h1 className="text-xl font-semibold sm:text-left mb-5">Quick Link</h1>
              <ul className="space-y-5">
                {
                  FooterLinks.map((map) => (
                    <li key={map.id}>
                      <a href={map.link}>{map.title}</a>
                    </li>
                  ))
                }
              </ul>
            </div>

            {/* {comany} */}

            <div className="py-8 px-4 col-span-2 sm:col-auto">
              <h1 className="text-xl font-semibold sm:text-left mb-5">
                Address
              </h1>
              <div className="flex items-center gap-3 mt-6">
                <a href="#">
                  <FaInstagram className="text-3xl hoer:text-primary duration-300" />
                </a>
                <a href="#">
                  <FaFacebook className="text-3xl hoer:text-primary duration-300" />
                </a>                <a href="#">
                  <FaLinkedin className="text-3xl hoer:text-primary duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* End */}
        <div className="bg-gray-200">
          <div className="text-xs md:text-sm container p-4 flex justify-between">
            <p>2025.....</p>
            <div className="flex justify-center items-center gap-3">
              <a href="#">About 1</a>
              <a href="#">About 2</a>
              <a href="#">About 4</a>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default Footer;
