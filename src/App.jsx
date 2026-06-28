import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import logo from './assets/basta_logo.webp';
import './App.css';

const circleImages = {
  1: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&q=80&w=400',
  2: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400',
  3: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400'
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function getPizzaSlicePath(startAngle, endAngle, radius) {
  const start = polarToCartesian(0, 0, radius, endAngle);
  const end = polarToCartesian(0, 0, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M 0 0 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

const defaultCardImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400';

const localizedData = {
  GR: {
    heroText: "Η Φιλοσοφία Μας",
    pizzaPromptTitle: "BENVENUTI",
    pizzaPromptText: "Η αυθεντική ιταλική εμπειρία κρύβεται στη λεπτομέρεια. Αγγίξτε ένα κομμάτι της πίτσας για να ανακαλύψετε τα μυστικά μας.",
    footerTitle: "Σας θέλουμε μαζί μας σε αυτό το ταξίδι ιταλικών γεύσεων.",
    footerPhoneText: "Κρατησεις / Takeaway",
    storeButton: "ΣΤΟ ΜΑΓΑΖΙ ΜΑΣ",
    menu: [
      { title: "PIZZA", icon: "🍕", items: [
        { name: "Margherita", desc: "Σάλτσα ντομάτας, φρέσκια μοτσαρέλα, βασιλικός", price: "9.50€" }, 
        { name: "Diavola", desc: "Πικάντικο σαλάμι, chili, μοτσαρέλα", price: "11.00€" }, 
        { name: "Tartufo", desc: "Κρέμα τρούφας, άγρια μανιτάρια, παρμεζάνα", price: "13.50€" }
      ]},
      { title: "PASTA", icon: "🍝", items: [
        { name: "Carbonara", desc: "Guanciale, πεκορίνο, κρόκος αυγού, μαύρο πιπέρι", price: "12.00€" }, 
        { name: "Pomodoro", desc: "Φρέσκια ντομάτα, σκόρδο, βασιλικός, ελαιόλαδο", price: "9.00€" }
      ]},
      { title: "INSALATE", icon: "🥗", items: [
        { name: "Burrata", desc: "Φρέσκια burrata, ντοματίνια, pesto βασιλικού", price: "10.50€" }, 
        { name: "Ceasar", desc: "Κοτόπουλο, παρμεζάνα, κρουτόν, αυθεντική sauce", price: "9.50€" }
      ]},
      { title: "DOLCI", icon: "🍰", items: [
        { name: "Tiramisu", desc: "Μασκαρπόνε, espresso, σαβαγιάρ, κακάο", price: "6.50€" }
      ]}
    ],
    pizzaSlices: [
      { id: 1, title: "ΦΡΕΣΚΑ ΥΛΙΚΑ", text: "Διαλεχτά υλικά, ολόφρεσκα λαχανικά και αυθεντικά ιταλικά τυριά.", icon: "🍅", start: -60, end: 60, midAngle: 0, color: "var(--basta-red)" },
      { id: 2, title: "ΠΟΙΟΤΗΤΑ", text: "Ποιότητα σε κάθε μπουκιά, φτιαγμένη με αγάπη και μεράκι.", icon: "⭐", start: 60, end: 180, midAngle: 120, color: "var(--spaghetti)" },
      { id: 3, title: "ΦΙΝΕΤΣΑ", text: "Η αυθεντική ιταλική φινέτσα και συνταγές κατευθείαν από τη Νάπολη.", icon: "🍷", start: 180, end: 300, midAngle: 240, color: "var(--text-main)" }
    ]
  },
  EN: {
    heroText: "Our Philosophy",
    pizzaPromptTitle: "BENVENUTI",
    pizzaPromptText: "The authentic Italian experience is all in the details. Tap a pizza slice to discover our secrets.",
    footerTitle: "Join us on this journey of Italian flavors.",
    footerPhoneText: "Reservations / Takeaway",
    storeButton: "VISIT STORE",
    menu: [
      { title: "PIZZA", icon: "🍕", items: [
        { name: "Margherita", desc: "Tomato sauce, fresh mozzarella, basil", price: "9.50€" }, 
        { name: "Diavola", desc: "Spicy salami, chili, mozzarella", price: "11.00€" }, 
        { name: "Tartufo", desc: "Truffle cream, wild mushrooms, parmesan", price: "13.50€" }
      ]},
      { title: "PASTA", icon: "🍝", items: [
        { name: "Carbonara", desc: "Guanciale, pecorino, egg yolk, black pepper", price: "12.00€" }, 
        { name: "Pomodoro", desc: "Fresh tomato, garlic, basil, olive oil", price: "9.00€" }
      ]},
      { title: "INSALATE", icon: "🥗", items: [
        { name: "Burrata", desc: "Fresh burrata, cherry tomatoes, basil pesto", price: "10.50€" }, 
        { name: "Ceasar", desc: "Chicken, parmesan, croutons, authentic sauce", price: "9.50€" }
      ]},
      { title: "DOLCI", icon: "🍰", items: [
        { name: "Tiramisu", desc: "Mascarpone, espresso, savoiardi, cocoa", price: "6.50€" }
      ]}
    ],
    pizzaSlices: [
      { id: 1, title: "FRESH INGREDIENTS", text: "Selected ingredients, fresh vegetables and authentic Italian cheeses.", icon: "🍅", start: -60, end: 60, midAngle: 0, color: "var(--basta-red)" },
      { id: 2, title: "TOP QUALITY", text: "Quality in every bite, made with love and passion.", icon: "⭐", start: 60, end: 180, midAngle: 120, color: "var(--spaghetti)" },
      { id: 3, title: "FINESSE", text: "Authentic Italian finesse and recipes straight from Napoli.", icon: "🍷", start: 180, end: 300, midAngle: 240, color: "var(--text-main)" }
    ]
  }
};

export default function App() {
  const [activeSlice, setActiveSlice] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState('GR');

  const content = localizedData[language];
  const { menu, pizzaSlices } = content;

  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <motion.header 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img src={logo} alt="Basta" className="hero-logo" />
        <div className="hero-overlay"></div>
        
        {/* Language Switcher */}
        <div className="language-switcher">
          <button className={language === 'GR' ? 'active' : ''} onClick={() => setLanguage('GR')}>🇬🇷</button>
          <button className={language === 'EN' ? 'active' : ''} onClick={() => setLanguage('EN')}>🇬🇧</button>
        </div>
      </motion.header>

      {/* Pizza Section */}
      <section className="pizza-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {content.heroText}
        </motion.h2>
        
        <motion.div 
          className="pizza-container"
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
        >
          <svg viewBox="-100 -100 200 200" className="pizza-svg">
            <circle cx="0" cy="0" r="95" fill="var(--spaghetti)" opacity="0.3" /> 
            {pizzaSlices.map((slice) => {
              const isActive = activeSlice === slice.id;
              const isAnyActive = activeSlice !== null;
              
              const offset = isActive ? 18 : 0;
              const rad = (slice.midAngle - 90) * Math.PI / 180;
              const moveX = Math.cos(rad) * offset;
              const moveY = Math.sin(rad) * offset;

              const textRad = (slice.midAngle - 90) * Math.PI / 180;
              const textX = Math.cos(textRad) * 55;
              const textY = Math.sin(textRad) * 55;

              return (
                <motion.g 
                  key={slice.id}
                  onClick={() => setActiveSlice(isActive ? null : slice.id)}
                  animate={{ 
                    x: moveX, 
                    y: moveY, 
                    scale: isActive ? 1.08 : 1, 
                    rotate: isActive ? 3 : 0,
                    opacity: isAnyActive && !isActive ? 0.3 : 1 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ cursor: 'pointer', transformOrigin: 'center' }}
                >
                  <path 
                    d={getPizzaSlicePath(slice.start, slice.end, 90)} 
                    fill={slice.color} 
                    stroke="var(--bg-color)" 
                    strokeWidth="3" 
                  />
                  <text x={textX} y={textY - 8} textAnchor="middle" dominantBaseline="middle" fontSize="22">{slice.icon}</text>
                  <text x={textX} y={textY + 14} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="inherit">{slice.title.split(' ')[0]}</text>
                  {slice.title.split(' ')[1] && <text x={textX} y={textY + 26} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="inherit">{slice.title.split(' ')[1]}</text>}
                </motion.g>
              );
            })}
          </svg>
        </motion.div>

        <div className="pizza-info-container">
          <AnimatePresence mode="wait">
            {activeSlice ? (
              <motion.div 
                key={activeSlice}
                className="pizza-info-card"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <img src={circleImages[activeSlice]} alt="Details" />
                <div className="pizza-info-text">
                  <h4>{pizzaSlices.find(s => s.id === activeSlice).title}</h4>
                  <p>{pizzaSlices.find(s => s.id === activeSlice).text}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="prompt-card"
                className="pizza-info-card default-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img src={defaultCardImage} alt="Philosophy" style={{ filter: 'brightness(0.95)' }} />
                <div className="pizza-info-text">
                  <h4>{content.pizzaPromptTitle}</h4>
                  <p>{content.pizzaPromptText}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Menu Section */}
      <motion.section 
        className="menu-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="tabs-container">
          {menu.map((cat, i) => (
            <button 
              key={i} 
              className={`tab-button ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div className="menu-card-wrapper">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab + language}
              className="menu-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="menu-card-header">
                <span className="menu-icon">{menu[activeTab].icon}</span>
                <h3>{menu[activeTab].title}</h3>
              </div>
              <div className="menu-items">
                {menu[activeTab].items.map((item, j) => (
                  <motion.div 
                    key={j} 
                    className="menu-item-row"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: j * 0.1 }}
                  >
                    <div className="menu-item-header">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                    <span className="menu-item-desc">{item.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Footer / CTA */}
      <motion.footer 
        className="footer-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="footer-text">{content.footerTitle}</p>
        <motion.a 
          href="https://maps.google.com" 
          className="red-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <MapPin size={22} /> <span>{content.storeButton}</span>
        </motion.a>

        <div className="footer-phone">
          <p>Takeaway</p>
          <a href="tel:+302101234567">210 123 4567</a>
        </div>
      </motion.footer>
    </div>
  );
}