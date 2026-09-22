const Logo = ({ size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="240 30 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="340" cy="130" r="100" fill="none" stroke="#7C5C3D" strokeWidth="5" />
      <circle cx="340" cy="130" r="84" fill="none" stroke="#7C5C3D" strokeWidth="3" strokeDasharray="4 6" />
      <circle cx="340" cy="130" r="82" fill="#EDE0C8" />

      <g transform="rotate(-45 340 130)">
        <ellipse cx="340" cy="94" rx="22" ry="28" fill="#5C4326" />
        <rect x="332" y="114" width="16" height="80" rx="8" fill="#5C4326" />
      </g>

      <g transform="rotate(45 340 130)">
        <line x1="340" y1="190" x2="340" y2="70" stroke="#3E4A2C" strokeWidth="5" />
        <ellipse cx="330" cy="88" rx="8" ry="13" fill="#7A5A16" transform="rotate(-30 330 88)" />
        <ellipse cx="350" cy="88" rx="8" ry="13" fill="#7A5A16" transform="rotate(30 350 88)" />
        <ellipse cx="330" cy="113" rx="8" ry="13" fill="#7A5A16" transform="rotate(-30 330 113)" />
        <ellipse cx="350" cy="113" rx="8" ry="13" fill="#7A5A16" transform="rotate(30 350 113)" />
        <ellipse cx="330" cy="138" rx="8" ry="13" fill="#7A5A16" transform="rotate(-30 330 138)" />
        <ellipse cx="350" cy="138" rx="8" ry="13" fill="#7A5A16" transform="rotate(30 350 138)" />
        <ellipse cx="330" cy="163" rx="8" ry="13" fill="#7A5A16" transform="rotate(-30 330 163)" />
        <ellipse cx="350" cy="163" rx="8" ry="13" fill="#7A5A16" transform="rotate(30 350 163)" />
      </g>
    </svg>
  );
};

export default Logo;