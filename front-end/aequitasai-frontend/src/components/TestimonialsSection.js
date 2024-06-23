// src/components/TestimonialsSection.js
import React from 'react';

const testimonials = [
  {
    name: "John Doe",
    feedback: "AequitasAI has transformed the way we draft legal documents. The AI is incredibly accurate and efficient.",
    company: "Law Firm Inc."
  },
  {
    name: "Jane Smith",
    feedback: "The integration with our existing tools was seamless. Real-time collaboration is a game-changer.",
    company: "Legal Solutions LLC"
  }
];

const TestimonialsSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-dark-blue">Testimonials</h2>
          <p className="mt-4 text-gray-600">Hear from our satisfied customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-light-gray p-6 rounded-lg shadow-md">
              <p className="text-lg italic text-gray-600">"{testimonial.feedback}"</p>
              <p className="mt-4 text-dark-blue font-bold">{testimonial.name}</p>
              <p className="text-gray-500">{testimonial.company}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
