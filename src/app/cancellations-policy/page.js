import React from 'react';

const CancellationPolicy = () => {
  const mainColor = '#943900';
  
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
      <header className="mb-10 text-center">
        <h1 
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: mainColor }}
        >
          Cancellation Policy
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
            Welcome to Dadi Maa Ke Laddu Cancellation Policy. This policy outlines the terms and conditions related to order cancellations for products purchased through our website. Please take a moment to review this policy before making a purchase. By placing an order, you agree to abide by the terms outlined below.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Order Cancellation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Cancellation Window</h3>
              <p className="leading-relaxed">
                You may request to cancel your order within [X] hours of placing it. Cancellation requests made after this period may not be accommodated.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Cancellation Process</h3>
              <p className="leading-relaxed">
                To request an order cancellation, please contact our customer support team via email at 
                <a 
                  href="mailto:info@dadimaakeladdu.com" 
                  className="font-medium"
                  style={{ color: mainColor }}
                >
                  info@dadimaakeladdu.com
                </a> 
                or through our website's contact form. Please provide your order details and reason for cancellation.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Eligibility for Refund
          </h2>
          <p className="leading-relaxed">
            If your order cancellation request is made within the specified cancellation window, you may be eligible for a refund. Refunds will be processed using the same payment method used for the original purchase.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Exceptions
          </h2>
          <p className="leading-relaxed mb-4">
            Please note that certain products or situations may be exempt from cancellation or refund eligibility:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-medium">Custom Orders:</span> Orders for custom-made or personalized products may not be eligible for cancellation once the production process has begun.
            </li>
            <li>
              <span className="font-medium">Perishable Goods:</span> Due to the nature of perishable items, orders for certain products like cakes may not be eligible for cancellation if the production process has already started.
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Partial Cancellations
          </h2>
          <p className="leading-relaxed">
            In some cases, you may wish to cancel only a portion of your order while keeping the rest. We will evaluate partial cancellation requests on a case-by-case basis and determine the appropriate refund based on the items canceled.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Refund Processing
          </h2>
          <p className="leading-relaxed">
            If your order cancellation is approved, the refund will be processed within 3 business days. Please allow additional time for the refund to reflect in your account, depending on your payment method and financial institution.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Contact Us
          </h2>
          <p className="leading-relaxed mb-4">
            If you have any questions or concerns about our Cancellation Policy, please contact us:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="font-medium w-24">Website:</span>
              <a 
                href="http://www.dadimaakeladdu.com" 
                className="font-medium"
                style={{ color: mainColor }}
              >
                www.dadimaakeladdu.com
              </a>
            </li>
            <li className="flex items-center">
              <span className="font-medium w-24">Email:</span>
              <a 
                href="mailto:info@dadimaakeladdu.com" 
                className="font-medium"
                style={{ color: mainColor }}
              >
                info@dadimaakeladdu.com
              </a>
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: mainColor }}
          >
            Changes to the Cancellation Policy
          </h2>
          <p className="leading-relaxed">
            Dadi Maa Ke Laddu reserves the right to modify or update this Cancellation Policy as needed. Any changes will be posted on this page, and the revised version will be effective immediately upon posting.
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
            Thank you for understanding our Cancellation Policy. We aim to provide clear guidelines to ensure a smooth experience for our customers. If you have any questions or require assistance, please don't hesitate to reach out to us. Your satisfaction is important to us, and we appreciate your business.
          </p>
        </section>
      </div>

      
    </div>
  );
};

export default CancellationPolicy;