import { Link } from 'react-router-dom';

const features = [
  {
    icon: '⚡',
    title: 'Zero Friction Logging',
    desc: 'Tap, snap, note. Log moments in seconds — not minutes. Your GPS does the rest.',
  },
  {
    icon: '📖',
    title: 'Story Mode',
    desc: 'Quick-capture your experiences like posting a story. One tap, one photo, done.',
  },
  {
    icon: '🔗',
    title: 'Share With Anyone',
    desc: 'Generate a public link for your trip. Friends get a beautiful itinerary, not a text wall.',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    desc: 'Coming soon — personalized itineraries powered by real traveler experiences.',
  },
];

export default function Landing() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-warm-50 to-orange-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-warm-300/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur rounded-full border border-gray-200/50 text-sm text-gray-600 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Your travel memories, never forgotten
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Every trip has a story.
            <br />
            <span className="text-brand-500">Never lose it again.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Log your travel moments effortlessly. Share real recommendations with friends.
            No more forgotten restaurants, hidden gems, or "I can't remember the name" moments.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3.5 shadow-lg shadow-brand-500/20">
              Start Your Diary
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3.5">
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Three steps. That's it. No learning curve, no setup, no friction.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create a Trip', desc: 'Name your trip and start logging. Takes 5 seconds.' },
            { step: '02', title: 'Log Moments', desc: 'Photo, note, rating, GPS — capture what matters as you go.' },
            { step: '03', title: 'Share the Link', desc: 'One link, your entire trip. Send it to anyone who asks.' },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 font-bold text-sm">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Remember every trip. Share every gem.
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Join travelers who believe the best recommendations come from real experiences — not algorithms.
        </p>
        <Link to="/signup" className="btn-primary text-lg px-8 py-3.5 shadow-lg shadow-brand-500/20">
          Get Started — It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>Wanderlogue — Built for travelers, by travelers.</p>
      </footer>
    </div>
  );
}
