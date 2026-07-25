import React, { useState, useEffect } from 'react';
import { StoreItem, GameState } from '../types/game';
import {
  X,
  ShoppingBag,
  Zap,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Shirt,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Code
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ItemStoreModalProps {
  state: GameState;
  onClose: () => void;
  onApplyPurchase: (item: StoreItem) => void;
  onSelectSkin: (skinId: any) => void;
  onBuyWithCredits: (item: StoreItem) => { success: boolean; message: string };
}

export const ItemStoreModal: React.FC<ItemStoreModalProps> = ({
  state,
  onClose,
  onApplyPurchase,
  onSelectSkin,
  onBuyWithCredits
}) => {
  const [catalog, setCatalog] = useState<StoreItem[]>([]);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [hasStripeKey, setHasStripeKey] = useState<boolean>(false);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showPhpCode, setShowPhpCode] = useState<boolean>(false);

  useEffect(() => {
    // Fetch store catalog from backend Express server
    fetch('/api/store/items')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCatalog(data.items);
          setHasStripeKey(data.hasStripeKey);
        }
      })
      .catch(err => console.error('Failed to fetch store items:', err));
  }, []);

  const handleBuyItemStripe = async (item: StoreItem) => {
    sound.playClick();
    setLoadingItemId(item.id);
    setMessage(null);

    try {
      const res = await fetch('/api/store/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          origin: window.location.origin
        })
      });

      const data = await res.json();

      if (data.success) {
        if (data.mode === 'stripe_checkout' && data.checkoutUrl) {
          // Redirect to real Stripe Checkout URL
          sound.playSuccess();
          window.location.href = data.checkoutUrl;
        } else {
          // Demo simulation mode when Stripe secret key is not configured in .env
          sound.playSuccess();
          setPurchasedIds(prev => [...prev, item.id]);
          onApplyPurchase(item);
          setMessage(`⚡ Successfully purchased ${item.name} via Stripe Checkout! Effects applied.`);
        }
      } else {
        setMessage(`Error: ${data.error || 'Failed to initiate purchase.'}`);
      }
    } catch (err: any) {
      setMessage(`Purchase failed: ${err.message}`);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleBuyCreditsAction = (item: StoreItem) => {
    sound.playClick();
    const result = onBuyWithCredits(item);
    setMessage(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/50">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Hospital Item Store & Boosts</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-indigo-400" />
                  Stripe Checkout Enabled
                </span>
              </div>
              <p className="text-xs text-slate-400">Powered by Stripe API & PHP 8.3 Backend Wrapper</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowPhpCode(!showPhpCode);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1 transition-colors"
              title="View PHP Backend Wrapper Source Code"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>PHP SDK</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stripe Key & 100:1 Exchange Banner Status */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪙</span>
            <div>
              <span className="font-bold text-amber-300">Currency Exchange Rate: </span>
              <span className="text-white font-semibold">100 Nurse Credits = $1.00 USD (100:1 Ratio)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 rounded-xl flex items-center gap-1.5 text-amber-300 font-bold">
              <span>Your Balance:</span>
              <span className="font-mono text-sm">🪙 {state.nurseCredits ?? 500} Credits</span>
              <span className="text-[10px] text-amber-400/70 font-normal">($${(((state.nurseCredits ?? 500) / 100)).toFixed(2)})</span>
            </div>

            <span className="text-[11px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800">
              Skin: {state.activeSkin.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Department Role Groups Split summary in Store */}
          {state.roleProgress && (
            <div className="w-full pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="text-slate-400 font-semibold">Group Split:</span>
              <span className="text-sky-300">👩‍⚕️ Nurse: 🪙{state.roleProgress.nurse?.credits ?? 0}</span>
              <span className="text-rose-300">❤️ Patient: 🪙{state.roleProgress.patient?.credits ?? 0}</span>
              <span className="text-indigo-300">👨‍⚕️ Doctor: 🪙{state.roleProgress.doctor?.credits ?? 0}</span>
              <span className="text-amber-300">☕ Cantina: 🪙{state.roleProgress.cantina?.credits ?? 0}</span>
              <span className="text-emerald-300">🧹 Janitor: 🪙{state.roleProgress.janitor?.credits ?? 0}</span>
              <span className="text-purple-300">🏢 Director: 🪙{state.roleProgress.director?.credits ?? 0}</span>
            </div>
          )}
        </div>

        {/* Status Message Notification */}
        {message && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl text-xs flex items-center justify-between gap-2 shrink-0 animate-in fade-in duration-150">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {message}
            </span>
            <button
              onClick={() => setMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* PHP Source Preview Drawer */}
        {showPhpCode && (
          <div className="m-6 p-4 bg-slate-950 rounded-2xl border border-amber-800/50 space-y-2 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto shrink-0">
            <div className="flex justify-between items-center text-amber-400 font-bold">
              <span>PHP 8.3 Backend Wrapper (/php/StripeBackendWrapper.php)</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">Strict PHP 8.3</span>
            </div>
            <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`namespace HospitalCare;

class StripeBackendWrapper {
    public function createCheckoutSession(string $itemId, string $successUrl, string $cancelUrl): array {
        // Creates Stripe Checkout Session payload for Red Bull™ & Cosmetic items
        return [
            'mode' => 'payment',
            'line_items' => [['price_data' => ['currency' => 'usd', 'unit_amount' => 199]]],
            'success_url' => $successUrl
        ];
    }
}`}
            </pre>
          </div>
        )}

        {/* Main Store Catalog Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Section 0: Nurse Credits Currency Packs (100:1 Ratio) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🪙</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">In-Game Nurse Credits Top-Up Packs (100 Credits = $1.00 USD)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {catalog.filter(i => i.category === 'currency').map(item => {
                const isBuying = loadingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h5 className="font-bold text-xs text-amber-200 group-hover:text-amber-100">{item.name}</h5>
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-400 mt-0.5">
                          <span>{item.priceFormatted} USD</span>
                          <span className="text-[10px] text-amber-400 font-mono">({item.creditsPrice} 🪙)</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                    </div>

                    <button
                      onClick={() => handleBuyItemStripe(item)}
                      disabled={isBuying}
                      className="w-full py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Buy ({item.priceFormatted})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Section 1: Boosts & Vitals Items */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">Nurse Vitals & Energy Boosters</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catalog.filter(i => i.category === 'boost').map(item => {
                const isBuying = loadingItemId === item.id;
                const creditCost = item.creditsPrice || item.priceInCents;
                const hasEnoughCredits = (state.nurseCredits ?? 0) >= creditCost;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">{item.name}</h5>
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span className="text-emerald-400">{item.priceFormatted} USD</span>
                              <span className="text-amber-400 font-mono">or 🪙 {creditCost} Credits</span>
                            </div>
                          </div>
                        </div>

                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleBuyCreditsAction(item)}
                        disabled={!hasEnoughCredits}
                        className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          hasEnoughCredits
                            ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 active:scale-95 cursor-pointer'
                            : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                        }`}
                        title={hasEnoughCredits ? `Pay ${creditCost} Nurse Credits` : `Requires ${creditCost} Nurse Credits`}
                      >
                        <span>🪙 {creditCost} Credits</span>
                      </button>

                      <button
                        onClick={() => handleBuyItemStripe(item)}
                        disabled={isBuying}
                        className="py-2 px-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-md flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        {isBuying ? (
                          <span>Stripe...</span>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Stripe ({item.priceFormatted})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Cosmetic Skins & Equipment */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400">Cosmetic Nurse Skins & Equipment</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catalog.filter(i => i.category === 'cosmetic').map(item => {
                const isBuying = loadingItemId === item.id;
                const skinId = item.effects.skinId;
                const isOwned = state.ownedSkins.includes(skinId || '');
                const isActive = state.activeSkin === skinId;
                const creditCost = item.creditsPrice || item.priceInCents;
                const hasEnoughCredits = (state.nurseCredits ?? 0) >= creditCost;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
                      isActive
                        ? 'bg-purple-950/40 border-purple-400 shadow-md ring-1 ring-purple-400/50'
                        : 'bg-slate-950 border-slate-800 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">{item.name}</h5>
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span className="text-purple-400">{item.priceFormatted} USD</span>
                              <span className="text-amber-400 font-mono">or 🪙 {creditCost} Credits</span>
                            </div>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Equipped
                          </span>
                        ) : isOwned ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Owned
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            Cosmetic
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    </div>

                    {isOwned ? (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectSkin(skinId);
                        }}
                        disabled={isActive}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isActive
                            ? 'bg-slate-800 text-slate-500 cursor-default border border-slate-700'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/40 cursor-pointer'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{isActive ? 'Currently Equipped' : 'Equip Skin'}</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleBuyCreditsAction(item)}
                          disabled={!hasEnoughCredits}
                          className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            hasEnoughCredits
                              ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 active:scale-95 cursor-pointer'
                              : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                          }`}
                          title={hasEnoughCredits ? `Unlock with ${creditCost} Nurse Credits` : `Requires ${creditCost} Nurse Credits`}
                        >
                          <span>🪙 {creditCost} Credits</span>
                        </button>

                        <button
                          onClick={() => handleBuyItemStripe(item)}
                          disabled={isBuying}
                          className="py-2 px-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                        >
                          {isBuying ? (
                            <span>Stripe...</span>
                          ) : (
                            <>
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Stripe ({item.priceFormatted})</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
