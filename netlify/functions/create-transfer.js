exports.handler = async (event) => {
  // Only POST requests are allowed
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: "Method not allowed"
      })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const {
      amount,
      fromCurrency,
      toCurrency,
      recipientName,
      recipientAccount
    } = data;

    // Basic validation
    if (!amount || Number(amount) <= 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Enter a valid amount."
        })
      };
    }

    if (!fromCurrency || !toCurrency) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Currency information is required."
        })
      };
    }

    if (!recipientName || !recipientAccount) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: "Recipient information is required."
        })
      };
    }

    /*
      IMPORTANT:
      Never put payment-provider API keys in app.js or index.html.

      Netlify environment variables will be used here later:

      PAYMENT_PROVIDER_URL
      PAYMENT_PROVIDER_SECRET

      The actual provider must be an authorized provider
      that supports the required India <-> Indonesia transfer.
    */

    const providerUrl = process.env.PAYMENT_PROVIDER_URL;
    const providerSecret = process.env.PAYMENT_PROVIDER_SECRET;

    if (!providerUrl || !providerSecret) {
      return {
        statusCode: 503,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          status: "provider_not_configured",
          message:
            "Payment provider is not connected yet. No real money has been moved."
        })
      };
    }

    /*
      Provider-specific API call goes here.

      Do NOT replace this with a fake success response.
      The real provider must return a transaction/reference ID.
    */

    const providerResponse = await fetch(providerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${providerSecret}`
      },
      body: JSON.stringify({
        amount: Number(amount),
        fromCurrency,
        toCurrency,
        recipientName,
        recipientAccount
      })
    });

    const providerData = await providerResponse.json();

    if (!providerResponse.ok) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          status: "provider_error",
          error: providerData?.message || "Payment provider rejected the request."
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        status: "submitted",
        transactionId:
          providerData.transactionId ||
          providerData.reference ||
          providerData.id ||
          null,
        providerResponse: providerData
      })
    };

  } catch (error) {
    console.error("Transfer error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: "Unable to process transfer request."
      })
    };
  }
};
