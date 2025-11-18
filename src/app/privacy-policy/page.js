import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
  const mainColor = '#943900';
  
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.6',
      color: '#333',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: mainColor, borderBottom: `2px solid ${mainColor}`, paddingBottom: '10px' }}>
          Privacy Policy
        </h1>
      </header>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Introduction</h2>
        <p>
          Welcome to the Privacy Policy of Dadi Maa Ke Laddu. This policy explains how we collect, use, protect, and share information obtained from visitors to our website, keeping in line with the laws of India. We highly value your privacy and are committed to providing you with clear insights into our data practices.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Contact Information</h2>
        <p>If you have any questions or concerns regarding this Privacy Policy, please feel free to reach out to us:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Website:   <Link href="http://www.dadimaakeladdu.com" style={{ color: mainColor }}>www.dadimaakeladdu.com</Link></li>
          <li>Email:  <Link href="mailto:info@dadimaakeladdu.com" style={{ color: mainColor }}>info@dadimaakeladdu.com</Link></li>
        </ul>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Information Collection and Usage</h2>
        <p>We gather specific personal information when you engage with our online bakery. This information includes:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Name:</strong> To personalize your experience.</li>
          <li><strong>Email Address:</strong> To send order notifications and updates.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Utilization of Collected Data</h2>
        <p>We use the collected information in the following ways:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Order Fulfillment:</strong> Personal data is used to efficiently process and fulfill your orders.</li>
          <li><strong>Communication:</strong> We keep you informed about your orders, as well as share information about promotions and offers.</li>
          <li><strong>Enhancing User Experience:</strong> Through data analysis, we continuously enhance our website and services.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Third-Party Engagement</h2>
        <p>
          Protecting your privacy is crucial. As per Indian law, we ensure that third parties do not process your personal information for their purposes. However, for secure payment transactions, we collaborate with trusted third-party payment processors.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Data Processing Location</h2>
        <p>
          Your information is processed within India, in compliance with the applicable data protection laws.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Children's Privacy</h2>
        <p>
          While our website is accessible to users of all ages, we do not knowingly collect personal data from children under 18 years old. Our services are not intended for minors.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Safeguarding Your Data</h2>
        <p>
          Safeguarding your personal information is a top priority. We have implemented stringent security measures to prevent unauthorized access and data breaches.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Your Data Rights</h2>
        <p>We respect your rights regarding your personal data as per Indian laws:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Access:</strong> You have the right to request information about the personal data we hold about you.</li>
          <li><strong>Rectification:</strong> If your data is inaccurate or incomplete, you can request us to correct it.</li>
          <li><strong>Erasure:</strong> You can request the deletion of your personal data from our records.</li>
          <li><strong>Objection:</strong> You have the right to object to the processing of your data for certain purposes.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Consent and Acceptance</h2>
        <p>
          By using our website, you consent to the terms outlined in this Privacy Policy, as per the laws of India.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Changes to the Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically in line with Indian regulations. Any changes will be promptly posted on this page, and the revised version will be effective immediately upon posting.
        </p>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <h2 style={{ color: mainColor }}>Conclusion</h2>
        <p>
          Thank you for trusting Dadi Maa Ke Laddu with your personal information. We are dedicated to maintaining transparency and complying with Indian data protection laws. If you have any questions or need further clarification, please contact us at <Link href="mailto:info@dadimaakeladdu.com" style={{ color: mainColor }}>info@dadimaakeladdu.com</Link>. Your satisfaction and privacy are of paramount importance to us, and we are committed to upholding these standards throughout your online bakery experience.
        </p>
      </section>

    
    </div>
  );
};

export default PrivacyPolicy;