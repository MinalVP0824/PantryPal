import { LemonDoodle } from './Doodles';

const LoadingSpinner = ({ text = 'Loading...', fullPage = true }) => {
  return (
    <div
      className={`flex items-center justify-center ${fullPage ? 'min-h-[50vh]' : 'py-8'}`}
    >
      <div className="flex flex-col items-center bg-[#F7F0DD] border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] px-10 py-8">
        <div className="animate-spin-slow opacity-70">
          <LemonDoodle size={60} />
        </div>
        <p className="font-handwritten text-lg text-ink/60 mt-3">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;