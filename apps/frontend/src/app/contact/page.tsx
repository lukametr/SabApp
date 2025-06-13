'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">კონტაქტი</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">დაგვიკავშირდით</h2>
          <p className="text-gray-600 mb-6">
            გაქვთ კითხვები ან წინადადებები? დაგვიკავშირდით და ჩვენ დაგეხმარებით.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">მისამართი</h3>
              <p className="text-gray-600">თბილისი, საქართველო</p>
            </div>

            <div>
              <h3 className="font-medium">ელ-ფოსტა</h3>
              <p className="text-gray-600">info@sabap.ge</p>
            </div>

            <div>
              <h3 className="font-medium">ტელეფონი</h3>
              <p className="text-gray-600">+995 32 123 4567</p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                სახელი
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                ელ-ფოსტა
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="form-label">
                თემა
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                შეტყობინება
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-field"
                rows={4}
                required
              />
            </div>

            {submitStatus === 'success' && (
              <p className="text-green-600">შეტყობინება წარმატებით გაიგზავნა!</p>
            )}

            {submitStatus === 'error' && (
              <p className="text-red-600">შეტყობინების გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით.</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'იგზავნება...' : 'გაგზავნა'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 