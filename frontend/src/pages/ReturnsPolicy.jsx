import React from "react";

const ReturnsPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-200 text-gray-800">
      <div className="max-w-5xl mx-auto px-5 lg:px-20 py-5 lg:py-24">
        {/* Header */}
        <header className="mb-8 lg:mb-12 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Returns Policy
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Last updated: {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-3 text-sm lg:text-base text-gray-700 max-w-3xl mx-auto">
            This Returns Policy explains how{" "}
            <strong>Shivrudray International Private Limited</strong> ("we",
            "our" or "us") handles returns for orders placed for sarees and women's accessories through our website.
          </p>
        </header>
        <div>
        <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              1. Return Policy
            </h2>
            <p className="leading-relaxed mb-2">
              We accept returns under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Return Window:</strong> Returns must be initiated within{" "}
                <strong>7 days</strong> of delivery.
              </li>
              <li>
                <strong>Product Condition:</strong> Products must be unused,
                unwashed, with original tags and packaging intact.
              </li>
              <li>
                <strong>Reason for Return:</strong> Defective items, wrong
                product received, or size mismatch (subject to availability).
              </li>
              <li>
                <strong>Non-Returnable Items:</strong> Customised or personalised
                products, items damaged by customer, or items without original
                packaging may not be eligible for return.
              </li>
            </ul>
          </section>

          {/* 3. Return Process */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              2. How to Initiate a Return
            </h2>
            <p className="leading-relaxed mb-2">
              To initiate a return, please follow these steps:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Contact us via email at{" "}
                <span className="text-blue-600">
                  shivrudrayinternational03@gmail.com
                </span>{" "}
                or call us at{" "}
                <span className="text-blue-600">+91 92744 90602</span> with your
                order ID.
              </li>
              <li>
                Provide clear photos/videos of the product if it's defective or
                damaged.
              </li>
              <li>
                Once approved, we will provide you with a return address and
                instructions.
              </li>
              <li>
                Pack the product securely in its original packaging and ship it
                back to us.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              3. Return Process
            </h2>
            <p className="leading-relaxed mb-2">
              Once we receive the returned product, we will inspect it and process the refund or exchange.
            </p>
          </section>
          
        </div>
      
      </div>
    </div>
  );
};

export default ReturnsPolicy;
