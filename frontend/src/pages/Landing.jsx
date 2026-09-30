import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import TypingText from '../components/TypingText';
import { GarlicDoodle, TomatoDoodle, LemonDoodle, HerbDoodle, ChiliDoodle } from '../components/Doodles';

const Landing = () => {
  return (
    <div>
      <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-12 py-8">
        <div className="flex-1 min-w-[280px]">
          <span className="inline-block bg-gingham text-card font-typewriter text-xs px-3 py-1.5 rounded-sm mb-4">
            AI-POWERED PANTRY MAGIC
          </span>
          <h1 className="font-typewriter text-3xl sm:text-4xl md:text-5xl leading-tight text-ink mb-4">
            Recipes that still taste
            <br />
            <TypingText words={['home cooked', 'homemade', 'like grandma\'s', 'fresh']} />
          </h1>
          <p className="text-ink/60 leading-relaxed mb-7 max-w-md">
            Type in what's sitting in your pantry, and get a full recipe back —
            scaled, saved, and ready to plan into your week.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/generate"
              className="bg-gingham text-card font-typewriter px-6 py-3.5 rounded-sm hover:bg-gingham-dark hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Generate a recipe →
            </Link>
            <Link
              to="/saved"
              className="border-2 border-kraft text-ink font-typewriter px-6 py-3 rounded-sm hover:bg-card-alt/40 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              See saved recipes
            </Link>
          </div>
        </div>

        <div className="flex-1 min-w-[260px] flex justify-center relative py-6">
          <div className="w-52 h-52 sm:w-72 sm:h-72 rounded-full border-4 border-gingham bg-card flex items-center justify-center hover:scale-105 hover:border-gingham-dark transition-all duration-300">
            <Logo size={140} />
          </div>
          <div className="absolute top-0 right-0 sm:top-2 bg-card border border-kraft px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-sm font-typewriter text-[10px] sm:text-xs shadow-[3px_3px_0_rgba(59,46,34,0.15)] flex items-center gap-2 hover:shadow-[4px_4px_0_rgba(59,46,34,0.25)] hover:-translate-y-0.5 transition-all">
            <span className="dark:invert"><LemonDoodle size={22} /></span>
            100% free<br />No sign-up needed
          </div>
          <div className="absolute bottom-0 left-0 sm:bottom-2 bg-card border border-kraft px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-sm font-typewriter text-[10px] sm:text-xs shadow-[3px_3px_0_rgba(59,46,34,0.15)] flex items-center gap-2 hover:shadow-[4px_4px_0_rgba(59,46,34,0.25)] hover:-translate-y-0.5 transition-all">
            <span className="dark:invert"><ChiliDoodle size={20} /></span>
            Generated in<br />seconds
          </div>
        </div>
      </div>

      <div className="bg-gingham -mx-4 sm:-mx-6 md:-mx-16 mt-4 py-8 sm:py-10 px-6 text-center">
        <h2 className="font-typewriter text-xl sm:text-2xl md:text-3xl text-card mb-2">
          PantryPal — AI-Powered Recipes, Zero Guesswork
        </h2>
        <p className="font-typewriter text-xs sm:text-sm text-card/80 tracking-wide">
          Smart generation · Meal planning · Grocery lists
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="font-typewriter text-xl text-center mb-8 border-b border-dashed border-kraft pb-3">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Add your ingredients', desc: 'Tag what\'s in your kitchen, plus any diet or cuisine preferences.', Doodle: GarlicDoodle },
            { step: '2', title: 'Get an AI recipe', desc: 'A full recipe is generated instantly, scaled to your servings.', Doodle: TomatoDoodle },
            { step: '3', title: 'Plan your week', desc: 'Save favorites, assign them to your weekly planner, get a grocery list.', Doodle: HerbDoodle },
          ].map((item, index) => (
            <div
              key={item.step}
              className={`bg-card border border-kraft rounded-sm shadow-[3px_3px_0_rgba(59,46,34,0.12)] p-5 hover:shadow-[5px_5px_0_rgba(59,46,34,0.25)] hover:-translate-y-1 hover:rotate-0 transition-all duration-200 cursor-default ${
                index % 2 === 0 ? 'rotate-[0.3deg]' : '-rotate-[0.3deg]'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-typewriter text-2xl text-gingham">{item.step}</span>
                <div className="opacity-60 dark:invert">
                  <item.Doodle size={40} />
                </div>
              </div>
              <h3 className="font-typewriter text-base mt-2">{item.title}</h3>
              <p className="text-sm text-ink/70 font-sans mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-16 mb-16">
        <h2 className="font-typewriter text-xl text-center mb-8 border-b border-dashed border-kraft pb-3">
          What's inside
        </h2>
        <div className="bg-card border-2 border-kraft rounded-sm shadow-[4px_4px_0_rgba(59,46,34,0.12)] p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
            {[
              { title: 'Smart recipe generation', desc: 'Powered by AI, tailored to what you actually have on hand.', Doodle: TomatoDoodle },
              { title: 'Servings scaler', desc: 'Adjust any recipe up or down, ingredients recalculate instantly.', Doodle: LemonDoodle },
              { title: 'Weekly meal planner', desc: 'Assign saved recipes to breakfast, lunch, and dinner across the week.', Doodle: HerbDoodle },
              { title: 'Grocery list builder', desc: 'Automatically combines ingredients across your whole week\'s plan.', Doodle: GarlicDoodle },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-3 items-start p-3 -m-0 rounded-sm hover:bg-card-alt/50 transition-colors group"
              >
                <div className="opacity-60 shrink-0 dark:invert group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <feature.Doodle size={36} />
                </div>
                <div>
                  <h3 className="font-typewriter text-sm">{feature.title}</h3>
                  <p className="text-sm text-ink/70 font-sans mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;