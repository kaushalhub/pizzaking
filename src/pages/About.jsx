import React from 'react';

export default function About() {
  const chefs = [
    {
      name: "Chef Luigi Rossi",
      role: "Master Pizzaiolo",
      bio: "Trained in Naples, Luigi has spent 15 years perfecting the 48-hour fermentation cycle of organic wheat sourdough.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Chef Maria Santoro",
      role: "Gourmet Toppings Developer",
      bio: "Maria curates relationships with local organic farms, creating unique seasonal configurations and cheese blends.",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571066811602-716837d681de?w=500&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black text-red-500 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-lg inline-block">
          Our Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">Crafting Slices Since 2018</h1>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Born out of a simple passion: to make authentic wood-fired style pizzas accessible in your home.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">The Sourdough Secret</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            At PizzaKing, we believe the heart of a great pizza is its crust. We don't use quick-rising commercial baker's yeast. Instead, we nurture a live sourdough starter that is over 8 years old, feeding it twice daily.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Every pizza dough ball is mixed by hand and allowed to ferment cold for 48 hours. This slow breakdown of starches creates a crust that is airy, chewy, slightly tangy, and incredibly light on the stomach.
          </p>
          <blockquote className="border-l-4 border-red-500 pl-4 py-1.5 italic text-sm text-slate-700 font-semibold bg-red-50/20 rounded-r-xl">
            "A fast pizza is a forgettable pizza. Sourdough takes patience, but the flavor is timeless."
          </blockquote>
        </div>
        
        {/* Story visual */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-80 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1541745711111-c8c29097957c?w=800&auto=format&fit=crop&q=80"
            alt="Hand kneading sourdough dough"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Chefs Section */}
      <div className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Meet Our Master Artisans</h2>
          <p className="text-sm text-slate-500">The skilled hands behind every crust and topping blend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {chefs.map((chef, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-center space-y-4">
              <img
                src={chef.image}
                alt={chef.name}
                className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-red-500/10 shadow"
              />
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-base leading-none">{chef.name}</h4>
                <span className="text-xs font-bold text-red-500 tracking-wide uppercase">{chef.role}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">{chef.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Gallery section */}
      <div className="space-y-6">
        <h3 className="text-center text-sm font-extrabold uppercase tracking-wider text-slate-400">Kitchen Gallery</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden h-40 sm:h-52 bg-slate-50 border border-slate-100 shadow-sm">
              <img
                src={img}
                alt="PizzaKing culinary preview"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
