import { GarlicDoodle, TomatoDoodle, LemonDoodle, HerbDoodle, ChiliDoodle } from './Doodles';

const DOODLES = [GarlicDoodle, TomatoDoodle, LemonDoodle, HerbDoodle, ChiliDoodle];

const cols = 6;
const rows = 7;

const cells = Array.from({ length: cols * rows }, (_, i) => {
  const col = i % cols;
  const row = Math.floor(i / cols);

  const baseLeft = (col + 0.5) * (100 / cols);
  const baseTop = (row + 0.5) * (100 / rows);

  const jitterX = (Math.random() - 0.5) * (100 / cols) * 0.65;
  const jitterY = (Math.random() - 0.5) * (100 / rows) * 0.65;

  const Doodle = DOODLES[Math.floor(Math.random() * DOODLES.length)];
  const rotation = Math.random() * 70 - 35;
  const size = 50 + Math.random() * 45;
  const opacity = 0.09 + Math.random() * 0.05;

  return {
    key: i,
    Doodle,
    left: `${baseLeft + jitterX}%`,
    top: `${baseTop + jitterY}%`,
    rotation,
    size,
    opacity,
  };
});

const DoodleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none dark:invert">
      {cells.map(({ key, Doodle, left, top, rotation, size, opacity }) => (
        <div
          key={key}
          className="absolute"
          style={{
            left,
            top,
            opacity,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          <Doodle size={size} />
        </div>
      ))}
    </div>
  );
};

export default DoodleBackground;