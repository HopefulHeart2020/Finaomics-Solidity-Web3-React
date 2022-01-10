import React from "react";
const navbarItem = [
  { href: "/", color: "#3772FF", content: "Coloring" },
  { href: "/", color: "#9757D7", content: "Sports" },
  { href: "/", color: "#45B26B", content: "Sports" },
  { href: "/", color: "white", content: "Sports" },
  { href: "/", color: "white", content: "MyLifeIs" },
  { href: "/", color: "white", content: "MyLifeIs" },
  { href: "/", color: "white", content: "NFTkcs" },
];
function Navbar() {
  return (
    <ul className="nav">
      {navbarItem.map((item, index) => (
        <li className="nav-item" key={index}>
          <a
            className="nav-link"
            style={{ color: item.color }}
            className=""
            href={item.href}
          >
            {item.content}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default Navbar;
