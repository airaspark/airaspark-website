import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus('Transmitting...');

  try {
    const response = await fetch(
      'https://formsubmit.co/ajax/contact@airaspark.com',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setStatus('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    }
  } catch (error) {
    console.error(error);
    setStatus('Failed to send message.');
  }
};

  return (
    <section id="contact" className="py-20 relative z-10 px-6 max-w-4xl mx-auto">
      <div className="glass-panel p-10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-display font-bold mb-6 text-white">Initialize Connect Portal</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="Identity / Name" 
            className="bg-[#09111D]/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4C8DFF] transition-colors"
            required 
          />
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            placeholder="Secure Transmission Email" 
            className="bg-[#09111D]/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4C8DFF] transition-colors"
            required 
          />
          <textarea 
            value={formData.message} 
            onChange={(e) => setFormData({...formData, message: e.target.value})} 
            placeholder="Transmission Content" 
            rows={4}
            className="bg-[#09111D]/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4C8DFF] transition-colors resize-none"
            required 
          />
          
          <button 
            type="submit"
            className="bg-white text-[#0B1220] hover:bg-[#4C8DFF] hover:text-white font-bold py-4 rounded-lg transition-all duration-300 font-display tracking-wide uppercase"
          >
            Transmit Signal
          </button>
          
          {status && (
            <p className="text-center mt-2 text-[#4C8DFF] font-mono text-sm tracking-wide bg-[#4C8DFF]/10 py-2 rounded">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}