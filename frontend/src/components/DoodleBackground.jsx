import { GarlicDoodle, TomatoDoodle, LemonDoodle, HerbDoodle, ChiliDoodle } from './Doodles';

const DoodleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute opacity-[0.14] rotate-[15deg]" style={{ top: '2%', left: '4%' }}>
        <GarlicDoodle size={80} />
      </div>
      <div className="absolute opacity-[0.14] -rotate-[10deg]" style={{ top: '4%', left: '24%' }}>
        <ChiliDoodle size={70} />
      </div>
      <div className="absolute opacity-[0.13] rotate-[20deg]" style={{ top: '3%', left: '48%' }}>
        <TomatoDoodle size={75} />
      </div>
      <div className="absolute opacity-[0.14] -rotate-[8deg]" style={{ top: '6%', right: '28%' }}>
        <HerbDoodle size={95} />
      </div>
      <div className="absolute opacity-[0.13] rotate-[6deg]" style={{ top: '5%', right: '6%' }}>
        <LemonDoodle size={90} />
      </div>

      <div className="absolute opacity-[0.14] -rotate-[18deg]" style={{ top: '15%', left: '10%' }}>
        <TomatoDoodle size={72} />
      </div>
      <div className="absolute opacity-[0.13] rotate-[24deg]" style={{ top: '17%', left: '36%' }}>
        <GarlicDoodle size={68} />
      </div>
      <div className="absolute opacity-[0.14] rotate-[10deg]" style={{ top: '16%', right: '38%' }}>
        <ChiliDoodle size={78} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[14deg]" style={{ top: '18%', right: '10%' }}>
        <HerbDoodle size={110} />
      </div>

      <div className="absolute opacity-[0.14] rotate-[22deg]" style={{ top: '28%', left: '3%' }}>
        <HerbDoodle size={120} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[16deg]" style={{ top: '30%', left: '28%' }}>
        <LemonDoodle size={75} />
      </div>
      <div className="absolute opacity-[0.14] rotate-[8deg]" style={{ top: '29%', right: '32%' }}>
        <TomatoDoodle size={80} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[10deg]" style={{ top: '27%', right: '4%' }}>
        <GarlicDoodle size={75} />
      </div>

      <div className="absolute opacity-[0.14] rotate-[16deg]" style={{ top: '40%', left: '14%' }}>
        <ChiliDoodle size={72} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[20deg]" style={{ top: '42%', left: '42%' }}>
        <HerbDoodle size={90} />
      </div>
      <div className="absolute opacity-[0.14] rotate-[12deg]" style={{ top: '41%', right: '18%' }}>
        <LemonDoodle size={80} />
      </div>

      <div className="absolute opacity-[0.13] -rotate-[12deg]" style={{ top: '52%', left: '6%' }}>
        <TomatoDoodle size={75} />
      </div>
      <div className="absolute opacity-[0.14] rotate-[26deg]" style={{ top: '54%', left: '32%' }}>
        <GarlicDoodle size={70} />
      </div>
      <div className="absolute opacity-[0.13] rotate-[14deg]" style={{ top: '53%', right: '30%' }}>
        <HerbDoodle size={100} />
      </div>
      <div className="absolute opacity-[0.14] -rotate-[8deg]" style={{ top: '55%', right: '5%' }}>
        <ChiliDoodle size={80} />
      </div>

      <div className="absolute opacity-[0.13] rotate-[18deg]" style={{ top: '64%', left: '18%' }}>
        <LemonDoodle size={78} />
      </div>
      <div className="absolute opacity-[0.14] -rotate-[22deg]" style={{ top: '66%', left: '44%' }}>
        <TomatoDoodle size={70} />
      </div>
      <div className="absolute opacity-[0.13] rotate-[10deg]" style={{ top: '65%', right: '14%' }}>
        <GarlicDoodle size={78} />
      </div>

      <div className="absolute opacity-[0.14] -rotate-[14deg]" style={{ top: '75%', left: '5%' }}>
        <HerbDoodle size={105} />
      </div>
      <div className="absolute opacity-[0.13] rotate-[24deg]" style={{ top: '77%', left: '30%' }}>
        <ChiliDoodle size={72} />
      </div>
      <div className="absolute opacity-[0.14] rotate-[6deg]" style={{ top: '76%', right: '36%' }}>
        <LemonDoodle size={82} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[18deg]" style={{ top: '78%', right: '6%' }}>
        <TomatoDoodle size={76} />
      </div>

      <div className="absolute opacity-[0.14] rotate-[12deg]" style={{ bottom: '2%', left: '12%' }}>
        <GarlicDoodle size={70} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[16deg]" style={{ bottom: '4%', left: '40%' }}>
        <HerbDoodle size={95} />
      </div>
      <div className="absolute opacity-[0.14] rotate-[28deg]" style={{ bottom: '3%', right: '24%' }}>
        <ChiliDoodle size={78} />
      </div>
      <div className="absolute opacity-[0.13] -rotate-[10deg]" style={{ bottom: '2%', right: '4%' }}>
        <LemonDoodle size={85} />
      </div>
    </div>
  );
};

export default DoodleBackground;