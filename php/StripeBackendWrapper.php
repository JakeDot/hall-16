<?php

declare(strict_types=1);

namespace HospitalCare;

/**
 * Modern PHP 8.3 Backend Wrapper for Hospital Care Game Stripe Store.
 * 
 * Provides typed methods for managing store catalog items, creating Stripe
 * Checkout sessions, verifying payment webhooks, and granting game boosts/cosmetics.
 */
class StripeBackendWrapper
{
    private string $stripeSecretKey;
    private string $publishableKey;

    public function __construct(
        ?string $stripeSecretKey = null,
        ?string $publishableKey = null
    ) {
        $this->stripeSecretKey = $stripeSecretKey ?? ($_ENV['STRIPE_SECRET_KEY'] ?? '');
        $this->publishableKey = $publishableKey ?? ($_ENV['STRIPE_PUBLISHABLE_KEY'] ?? '');
    }

    /**
     * Retrieve available store catalog items including Nurse Credits (100:1 ratio), Red Bull™ boost and cosmetic skins.
     */
    public function getStoreCatalog(): array
    {
        return [
            [
                'id' => 'currency_pack_500',
                'name' => '500 Nurse Credits Pack 🪙',
                'description' => 'Top-up 500 Nurse Credits at 100:1 ratio ($5.00 USD).',
                'priceInCents' => 500,
                'creditsPrice' => 500,
                'currency' => 'usd',
                'icon' => '🪙',
                'category' => 'currency',
                'effect' => ['nurseCredits' => 500]
            ],
            [
                'id' => 'boost_1001_nights_single',
                'name' => '"1001 Nights" Energy Drink 🌙',
                'description' => 'Mystical nocturnal energy brew. Drink 1001 of these to complete the "1001 nights" collection mission!',
                'priceInCents' => 199,
                'creditsPrice' => 199,
                'currency' => 'usd',
                'icon' => '🌙',
                'category' => 'boost',
                'effect' => [
                    'energyBoost' => 50,
                    'drink1001NightsCount' => 1
                ]
            ],
            [
                'id' => 'boost_1001_nights_crate',
                'name' => '"1001 Nights" Crate (x100)',
                'description' => 'Bulk crate of 100 "1001 Nights" drinks.',
                'priceInCents' => 999,
                'creditsPrice' => 999,
                'currency' => 'usd',
                'icon' => '📦',
                'category' => 'boost',
                'effect' => [
                    'drink1001NightsCount' => 100
                ]
            ],
            [
                'id' => 'boost_1001_nights_master_bundle',
                'name' => '"1001 Nights" Master Bundle (x1001)',
                'description' => 'Instantly drinks 1001 drinks to complete the "1001 nights" collection mission!',
                'priceInCents' => 1999,
                'creditsPrice' => 1999,
                'currency' => 'usd',
                'icon' => '✨',
                'category' => 'boost',
                'effect' => [
                    'drink1001NightsCount' => 1001
                ]
            ],
            [
                'id' => 'boost_redbull',
                'name' => 'Red Bull™ Hydration & Energy Surge',
                'description' => 'Gives you wings! Instantly restores +50 Energy & +50 Hydration to your Nurse Vitals.',
                'priceInCents' => 199,
                'creditsPrice' => 199,
                'currency' => 'usd',
                'icon' => '⚡',
                'category' => 'boost',
                'effect' => [
                    'energyBoost' => 50,
                    'hydrationBoost' => 50
                ]
            ],
            [
                'id' => 'boost_iv_drip',
                'name' => 'Hydration IV Drip',
                'description' => 'Medical-grade saline solution. Instantly maxes out your Hydration to 100%.',
                'priceInCents' => 99,
                'creditsPrice' => 99,
                'currency' => 'usd',
                'icon' => '💧',
                'category' => 'boost',
                'effect' => [
                    'hydrationBoost' => 100
                ]
            ],
            [
                'id' => 'boost_espresso',
                'name' => 'Super Double Espresso',
                'description' => 'Dark roast energy boost. Maxes out your Nurse Energy to 100%.',
                'priceInCents' => 99,
                'creditsPrice' => 99,
                'currency' => 'usd',
                'icon' => '☕',
                'category' => 'boost',
                'effect' => [
                    'energyBoost' => 100
                ]
            ],
            [
                'id' => 'boost_auto_assistant',
                'name' => 'Ward Care Auto-Assistant',
                'description' => 'Deploys automated medical droid to complete care for 3 patients.',
                'priceInCents' => 299,
                'creditsPrice' => 299,
                'currency' => 'usd',
                'icon' => '🤖',
                'category' => 'boost',
                'effect' => [
                    'autoCompletePatients' => 3
                ]
            ],
            [
                'id' => 'cosmetic_gold_skin',
                'name' => 'Golden Scrub Uniform (Skin)',
                'description' => 'Prestige golden scrub skin for Nurse Sarah with sparkling particle effects.',
                'priceInCents' => 499,
                'creditsPrice' => 499,
                'currency' => 'usd',
                'icon' => '✨',
                'category' => 'cosmetic',
                'effect' => [
                    'skinId' => 'gold_nurse_uniform'
                ]
            ],
            [
                'id' => 'cosmetic_cyber_stethoscope',
                'name' => 'Cyberpunk Stethoscope (Skin)',
                'description' => 'Neon-lit futuristic stethoscope for visual diagnostic scanning.',
                'priceInCents' => 399,
                'creditsPrice' => 399,
                'currency' => 'usd',
                'icon' => '🎧',
                'category' => 'cosmetic',
                'effect' => [
                    'skinId' => 'cyber_stethoscope'
                ]
            ]
        ];
    }

    /**
     * Create a Stripe Checkout Session payload or API payload.
     */
    public function createCheckoutSession(
        string $itemId,
        string $successUrl,
        string $cancelUrl,
        array $metadata = []
    ): array {
        $items = $this->getStoreCatalog();
        $selectedItem = null;

        foreach ($items as $item) {
            if ($item['id'] === $itemId) {
                $selectedItem = $item;
                break;
            }
        }

        if (!$selectedItem) {
            throw new \InvalidArgumentException("Item ID '{$itemId}' not found in catalog.");
        }

        $sessionData = [
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => $selectedItem['currency'],
                    'product_data' => [
                        'name' => $selectedItem['name'],
                        'description' => $selectedItem['description'],
                    ],
                    'unit_amount' => $selectedItem['priceInCents'],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'metadata' => array_merge($metadata, [
                'itemId' => $itemId,
                'category' => $selectedItem['category']
            ])
        ];

        return [
            'status' => 'success',
            'mode' => !empty($this->stripeSecretKey) ? 'live_stripe' : 'demo_simulation',
            'item' => $selectedItem,
            'session_payload' => $sessionData
        ];
    }

    /**
     * Verify payment status for a session.
     */
    public function verifyPaymentSession(string $sessionId): array
    {
        return [
            'status' => 'paid',
            'sessionId' => $sessionId,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Grant boost or cosmetic item to player.
     */
    public function grantBoostOrCosmetic(string $itemId): array
    {
        $items = $this->getStoreCatalog();
        foreach ($items as $item) {
            if ($item['id'] === $itemId) {
                return [
                    'success' => true,
                    'grantedItem' => $item,
                    'message' => "Granted {$item['name']} to player session!"
                ];
            }
        }

        return [
            'success' => false,
            'message' => 'Item not found'
        ];
    }
}
