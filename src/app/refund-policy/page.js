import Link from 'next/link';
import React from 'react';

const RefundPolicy = () => {
  const mainColor = '#943900';
  
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
      <header className="mb-10 text-center">
        <h1 
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: mainColor }}
        >
          Refund Policy
        </h1>
        <div 
          className="h-1 w-24 mx-auto rounded-full"
          style={{ backgroundColor: mainColor }}
        ></div>
      </header>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Introduction
          </h2>
          <p className="leading-relaxed">
            Welcome to Dadi Maa Ke Laddu's Refund Policy. This policy outlines the terms and conditions for requesting refunds for products purchased through our website. Please read this policy carefully before making a purchase. By placing an order, you agree to abide by the terms outlined below.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Eligibility for Refunds
          </h2>
          <p className="leading-relaxed mb-4">
            We offer refunds under the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-medium">Incorrect or Damaged Products:</span> If you receive products that are damaged during shipping or are not the items you ordered, you may be eligible for a refund or replacement.
            </li>
            <li>
              <span className="font-medium">Quality Issues:</span> If the product you receive does not meet our quality standards, you may be eligible for a refund or replacement.
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Process for Requesting Refunds
          </h2>
          <p className="leading-relaxed mb-4">
            To request a refund, please follow these steps:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Contact our customer support within 48 hours of receiving the product.</li>
            <li>Provide clear photographs or evidence of the issue, including images of any damage or quality concerns.</li>
            <li>Our customer support team will review your request and may require additional information for assessment.</li>
          </ol>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Refund Approval
          </h2>
          <p className="leading-relaxed mb-4">
            If your refund request is approved, you may be eligible for:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-medium">Full Refund:</span> If the issue is validated, you will receive a full refund for the purchase price of the product.
            </li>
            <li>
              <span className="font-medium">Partial Refund:</span> In some cases, we may offer a partial refund depending on the nature of the issue.
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Refund Processing
          </h2>
          <p className="leading-relaxed">
            Refunds will be processed using the same payment method used for the original purchase or in your wallet account. Please allow up to 3 business days for the refund to appear in your account.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Exclusions
          </h2>
          <p className="leading-relaxed mb-4">
            The following situations are not eligible for refunds:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Change of mind or taste preferences after purchase.</li>
            <li>Failure to properly store or handle products after delivery.</li>
            <li>Delayed deliveries due to reasons beyond our control (e.g., shipping delays, natural disasters).</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Contact Us
          </h2>
          <p className="leading-relaxed mb-4">
            If you believe you are eligible for a refund or have any questions about our refund policy, please contact us:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="font-medium w-24">Website:</span>
               <Link
                href="http://www.dadimaakeladdu.com" 
                className="font-medium"
                style={{ color: mainColor }}
              >
                www.dadimaakeladdu.com
              </Link>
            </li>
            <li className="flex items-center">
              <span className="font-medium w-24">Email:</span>
              <Link
                href="mailto:info@dadimaakeladdu.com" 
                className="font-medium"
                style={{ color: mainColor }}
              >
                info@dadimaakeladdu.com
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Changes to the Refund Policy
          </h2>
          <p className="leading-relaxed">
            Dadi Maa Ke Laddu reserves the right to modify or update this Refund Policy at any time. Any changes will be posted on this page, and the revised version will be effective immediately upon posting.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Conclusion
          </h2>
          <p className="leading-relaxed">
            Thank you for understanding our Refund Policy. We strive to provide you with the best products and service, and we are committed to addressing any issues that may arise. If you have any questions or concerns, please don't hesitate to contact us. Your satisfaction is important to us.
          </p>
        </section>
      </div>

     
    </div>
  );
};

export default RefundPolicy;