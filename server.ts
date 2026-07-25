import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";

// Store Catalog Data (100:1 Ratio: 100 Nurse Credits = $1.00 USD)
export const STORE_CATALOG = [
  {
    id: "currency_pack_100",
    name: "100 Nurse Credits Pack 🪙",
    description: "Top-up 100 in-game Nurse Credits! Perfect for buying energy drinks or IV saline drips.",
    priceInCents: 100,
    priceFormatted: "$1.00",
    creditsPrice: 100,
    currency: "usd",
    icon: "🪙",
    badge: "100:1 Starter",
    category: "currency",
    effects: { nurseCredits: 100 }
  },
  {
    id: "currency_pack_500",
    name: "500 Nurse Credits Pack 🪙",
    description: "Top-up 500 in-game Nurse Credits! Unlock legendary scrub skins and auto-assistant droids.",
    priceInCents: 500,
    priceFormatted: "$5.00",
    creditsPrice: 500,
    currency: "usd",
    icon: "🪙",
    badge: "Best Value",
    category: "currency",
    effects: { nurseCredits: 500 }
  },
  {
    id: "currency_pack_1000",
    name: "1,000 Nurse Credits Pack 🪙",
    description: "Top-up 1,000 in-game Nurse Credits! Stock up on nocturnal 1001 Nights energy drinks.",
    priceInCents: 1000,
    priceFormatted: "$10.00",
    creditsPrice: 1000,
    currency: "usd",
    icon: "💰",
    badge: "1,000 Credits",
    category: "currency",
    effects: { nurseCredits: 1000 }
  },
  {
    id: "currency_pack_2500",
    name: "2,500 Nurse Credits Chest 🪙",
    description: "Massive chest containing 2,500 Nurse Credits at the exact 100:1 exchange rate!",
    priceInCents: 2500,
    priceFormatted: "$25.00",
    creditsPrice: 2500,
    currency: "usd",
    icon: "👑",
    badge: "Mega Chest",
    category: "currency",
    effects: { nurseCredits: 2500 }
  },
  {
    id: "boost_1001_nights_single",
    name: "\"1001 Nights\" Energy Drink 🌙",
    description: "Mystical nocturnal energy brew. Drink 1001 of these to complete the first Collection Mission \"1001 nights\" and earn the legendary achievement!",
    priceInCents: 199,
    priceFormatted: "$1.99",
    creditsPrice: 199,
    currency: "usd",
    icon: "🌙",
    badge: "1001 Nights Mission",
    category: "boost",
    effects: { energy: 50, hydration: 50, drink1001NightsCount: 1 }
  },
  {
    id: "boost_1001_nights_crate",
    name: "\"1001 Nights\" Crate (x100 Drinks)",
    description: "A bulk crate containing 100 \"1001 Nights\" energy drinks. Maxes out your vitals and adds +100 towards the 1001 Nights collection mission!",
    priceInCents: 999,
    priceFormatted: "$9.99",
    creditsPrice: 999,
    currency: "usd",
    icon: "📦",
    badge: "100x Bulk Pack",
    category: "boost",
    effects: { energy: 100, hydration: 100, drink1001NightsCount: 100 }
  },
  {
    id: "boost_1001_nights_master_bundle",
    name: "\"1001 Nights\" Master Bundle (x1001 Drinks)",
    description: "The ultimate 1001-drink nocturnal stockpile! Instantly drinks 1001 drinks to complete the \"1001 nights\" Collection Mission and unlock the Achievement!",
    priceInCents: 1999,
    priceFormatted: "$19.99",
    creditsPrice: 1999,
    currency: "usd",
    icon: "✨",
    badge: "Instant Complete 🏆",
    category: "boost",
    effects: { energy: 100, hydration: 100, drink1001NightsCount: 1001 }
  },
  {
    id: "boost_redbull",
    name: "Red Bull™ Energy & Hydration Surge",
    description: "Gives you wings! Instantly restores +50 Energy & +50 Hydration to your Nurse Vitals.",
    priceInCents: 199,
    priceFormatted: "$1.99",
    creditsPrice: 199,
    currency: "usd",
    icon: "⚡",
    badge: "Most Popular",
    category: "boost",
    effects: { energy: 50, hydration: 50 }
  },
  {
    id: "boost_iv_drip",
    name: "Hydration IV Saline Drip",
    description: "Medical-grade saline solution. Instantly maxes out your Hydration to 100%.",
    priceInCents: 99,
    priceFormatted: "$0.99",
    creditsPrice: 99,
    currency: "usd",
    icon: "💧",
    category: "boost",
    effects: { hydration: 100 }
  },
  {
    id: "boost_espresso",
    name: "Super Double Espresso Shot",
    description: "Dark roast caffeine boost. Instantly maxes out your Nurse Energy to 100%.",
    priceInCents: 99,
    priceFormatted: "$0.99",
    creditsPrice: 99,
    currency: "usd",
    icon: "☕",
    category: "boost",
    effects: { energy: 100 }
  },
  {
    id: "boost_auto_assistant",
    name: "Ward Care Auto-Assistant",
    description: "Deploys automated medical droid to complete care for 3 pending patients.",
    priceInCents: 299,
    priceFormatted: "$2.99",
    creditsPrice: 299,
    currency: "usd",
    icon: "🤖",
    badge: "Auto Care",
    category: "boost",
    effects: { autoCompleteCount: 3 }
  },
  {
    id: "cosmetic_gold_skin",
    name: "Golden Scrub Uniform (Skin)",
    description: "Prestige golden scrub skin for Nurse Sarah with sparkling particle effects.",
    priceInCents: 499,
    priceFormatted: "$4.99",
    creditsPrice: 499,
    currency: "usd",
    icon: "✨",
    badge: "Legendary Cosmetic",
    category: "cosmetic",
    effects: { skinId: "gold_nurse_uniform" }
  },
  {
    id: "cosmetic_cyber_stethoscope",
    name: "Cyberpunk Stethoscope (Skin)",
    description: "Neon-lit futuristic stethoscope for visual diagnostic scanning.",
    priceInCents: 399,
    priceFormatted: "$3.99",
    creditsPrice: 399,
    currency: "usd",
    icon: "🎧",
    category: "cosmetic",
    effects: { skinId: "cyber_stethoscope" }
  },
  {
    id: "cosmetic_titanium_syringe",
    name: "Titanium Rx Syringe (Skin)",
    description: "High-tech polished medical equipment skin.",
    priceInCents: 299,
    priceFormatted: "$2.99",
    creditsPrice: 299,
    currency: "usd",
    icon: "💉",
    category: "cosmetic",
    effects: { skinId: "titanium_syringe" }
  }
];

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripeClient = new Stripe(key, {
        apiVersion: "2023-10-16" as any
      });
    }
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // 1. Get Store Catalog
  app.get("/api/store/items", (req, res) => {
    res.json({
      success: true,
      hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
      items: STORE_CATALOG
    });
  });

  // 2. Create Stripe Checkout Session
  app.post("/api/store/create-checkout-session", async (req, res) => {
    try {
      const { itemId, origin } = req.body;
      const item = STORE_CATALOG.find(i => i.id === itemId);

      if (!item) {
        return res.status(404).json({ success: false, error: "Item not found" });
      }

      const stripe = getStripe();
      const baseOrigin = origin || "http://localhost:3000";

      if (stripe) {
        // Real Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: item.currency,
                product_data: {
                  name: item.name,
                  description: item.description,
                },
                unit_amount: item.priceInCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${baseOrigin}/?session_id={CHECKOUT_SESSION_ID}&purchased_item=${item.id}&status=success`,
          cancel_url: `${baseOrigin}/?status=cancelled`,
          metadata: {
            itemId: item.id,
            category: item.category
          }
        });

        return res.json({
          success: true,
          mode: "stripe_checkout",
          checkoutUrl: session.url,
          sessionId: session.id
        });
      } else {
        // Instant Demo Simulation Mode when Stripe Secret Key is not configured
        const fakeSessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        return res.json({
          success: true,
          mode: "demo_simulation",
          message: "Stripe API Key not configured in .env. Falling back to instant demo checkout.",
          sessionId: fakeSessionId,
          item: item
        });
      }
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to create checkout session" });
    }
  });

  // 3. Fulfill Purchase
  app.post("/api/store/fulfill-purchase", (req, res) => {
    const { itemId, sessionId } = req.body;
    const item = STORE_CATALOG.find(i => i.id === itemId);

    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    res.json({
      success: true,
      message: `Successfully fulfilled purchase: ${item.name}!`,
      item,
      sessionId
    });
  });

  // 4. PHP Wrapper Info API
  app.get("/api/php-wrapper/info", (req, res) => {
    res.json({
      success: true,
      phpWrapperVersion: "8.3",
      wrapperFiles: [
        "/php/StripeBackendWrapper.php",
        "/php/api_wrapper.php"
      ],
      description: "Complete PHP 8.3 OOP backend SDK wrapper for handling Stripe Store items, checkout sessions, and webhook fulfillments."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hospital Game Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
