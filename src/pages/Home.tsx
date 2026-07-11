import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Solutions from "../components/Solutions";
import TechShowcase from "../components/TechShowcase";
import FutureVision from "../components/FutureVision";
import Community from "../components/Community";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-[#0B1220] text-white min-h-screen font-sans selection:bg-[#4C8DFF] selection:text-white overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Solutions />
        <TechShowcase />
        <FutureVision />
        <Community />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}