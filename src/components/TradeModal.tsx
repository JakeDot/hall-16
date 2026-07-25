import React, { useState } from 'react';
import {
  X,
  ArrowLeftRight,
  Sparkles,
  Coins,
  Package,
  Handshake,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  Gift,
  HelpCircle,
  History
} from 'lucide-react';
import { GameState, RoleGroup, ROLE_GROUP_INFO, Item } from '../types/game';
import { Favour, TradeItem, ROLE_FAVOURS, ROLE_CATALOG_ITEMS } from '../data/tradeData';
import { sound } from '../utils/audio';

interface TradeModalProps {
  state: GameState;
  onClose: () => void;
  onExecuteTrade: (tradeData: {
    fromRole: RoleGroup;
    toRole: RoleGroup;
    offeredItems: Item[];
    offeredFavours: Favour[];
    offeredCredits: number;
    requestedItems: TradeItem[];
    requestedFavours: Favour[];
    requestedCredits: number;
  }) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  state,
  onClose,
  onExecuteTrade
}) => {
  const currentRole: RoleGroup = state.activeRole || 'nurse';
  const [partnerRole, setPartnerRole] = useState<RoleGroup>(
    currentRole === 'doctor' ? 'nurse' : 'doctor'
  );

  // Active Category View Tab
  const [activeTab, setActiveTab] = useState<'all' | 'items' | 'favours' | 'credits'>('all');

  // Offered selection by player
  const [offeredInventoryItems, setOfferedInventoryItems] = useState<Item[]>([]);
  const [offeredFavours, setOfferedFavours] = useState<Favour[]>([]);
  const [offeredCredits, setOfferedCredits] = useState<number>(0);

  // Requested selection from partner
  const [requestedCatalogItems, setRequestedCatalogItems] = useState<TradeItem[]>([]);
  const [requestedFavours, setRequestedFavours] = useState<Favour[]>([]);
  const [requestedCredits, setRequestedCredits] = useState<number>(0);

  const [tradeHistory, setTradeHistory] = useState<{
    id: string;
    text: string;
    time: string;
  }[]>([]);

  const senderRoleMeta = ROLE_GROUP_INFO[currentRole];
  const partnerRoleMeta = ROLE_GROUP_INFO[partnerRole];

  // Available items to offer from player inventory
  const playerInventory = state.inventory || [];
  // Available favours to offer from current role
  const senderFavours = ROLE_FAVOURS[currentRole] || [];

  // Available catalog items from partner
  const partnerCatalogItems = ROLE_CATALOG_ITEMS[partnerRole] || [];
  // Available favours from partner
  const partnerFavours = ROLE_FAVOURS[partnerRole] || [];

  // Calculate Total Values
  const offeredItemsValue = offeredInventoryItems.length * 35; // base estimated value
  const offeredFavoursValue = offeredFavours.reduce((sum, f) => sum + f.creditValue, 0);
  const totalOfferedValue = offeredItemsValue + offeredFavoursValue + offeredCredits;

  const requestedItemsValue = requestedCatalogItems.reduce((sum, i) => sum + i.creditValue, 0);
  const requestedFavoursValue = requestedFavours.reduce((sum, f) => sum + f.creditValue, 0);
  const totalRequestedValue = requestedItemsValue + requestedFavoursValue + requestedCredits;

  // Acceptance calculation
  const valueRatio = totalRequestedValue > 0 ? totalOfferedValue / totalRequestedValue : (totalOfferedValue > 0 ? 1.5 : 0);
  const isAcceptable = (totalOfferedValue === 0 && totalRequestedValue === 0) ? false : valueRatio >= 0.85;

  const handleToggleOfferedItem = (item: Item) => {
    sound.playClick();
    if (offeredInventoryItems.some(i => i.id === item.id)) {
      setOfferedInventoryItems(offeredInventoryItems.filter(i => i.id !== item.id));
    } else {
      setOfferedInventoryItems([...offeredInventoryItems, item]);
    }
  };

  const handleToggleOfferedFavour = (favour: Favour) => {
    sound.playClick();
    if (offeredFavours.some(f => f.id === favour.id)) {
      setOfferedFavours(offeredFavours.filter(f => f.id !== favour.id));
    } else {
      setOfferedFavours([...offeredFavours, favour]);
    }
  };

  const handleToggleRequestedItem = (item: TradeItem) => {
    sound.playClick();
    if (requestedCatalogItems.some(i => i.id === item.id)) {
      setRequestedCatalogItems(requestedCatalogItems.filter(i => i.id !== item.id));
    } else {
      setRequestedCatalogItems([...requestedCatalogItems, item]);
    }
  };

  const handleToggleRequestedFavour = (favour: Favour) => {
    sound.playClick();
    if (requestedFavours.some(f => f.id === favour.id)) {
      setRequestedFavours(requestedFavours.filter(f => f.id !== favour.id));
    } else {
      setRequestedFavours([...requestedFavours, favour]);
    }
  };

  const handleConfirmTrade = () => {
    if (!isAcceptable) return;
    sound.playPillClink();

    onExecuteTrade({
      fromRole: currentRole,
      toRole: partnerRole,
      offeredItems: offeredInventoryItems,
      offeredFavours,
      offeredCredits,
      requestedItems: requestedCatalogItems,
      requestedFavours,
      requestedCredits
    });

    const newLog = {
      id: Math.random().toString(),
      text: `Traded with ${partnerRoleMeta.name}: Offered (${offeredInventoryItems.length} items, ${offeredFavours.length} favours, ${offeredCredits} cr) ➔ Received (${requestedCatalogItems.length} items, ${requestedFavours.length} favours, ${requestedCredits} cr)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTradeHistory([newLog, ...tradeHistory]);

    // Reset offers after execution
    setOfferedInventoryItems([]);
    setOfferedFavours([]);
    setOfferedCredits(0);
    setRequestedCatalogItems([]);
    setRequestedFavours([]);
    setRequestedCredits(0);
  };

  // Quick Deal Presets
  const handleApplyPresetDeal = (presetType: 'espresso' | 'grant' | 'meds') => {
    sound.playClick();
    if (presetType === 'espresso') {
      setPartnerRole('cantina');
      setOfferedCredits(50);
      setRequestedFavours([ROLE_FAVOURS.cantina[0]]); // Unlimited Espresso
      setRequestedCatalogItems([ROLE_CATALOG_ITEMS.cantina[0]]);
    } else if (presetType === 'grant') {
      setPartnerRole('director');
      setOfferedFavours([ROLE_FAVOURS[currentRole][0]]);
      setRequestedFavours([ROLE_FAVOURS.director[0]]); // Wing Grant
    } else if (presetType === 'meds') {
      setPartnerRole('nurse');
      setOfferedCredits(60);
      setRequestedCatalogItems([ROLE_CATALOG_ITEMS.nurse[0]]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg border border-purple-300/40">
              🤝
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Inter-Role Trading System</span>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Items • Favours • Credits
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Negotiate value exchanges between hospital departments using items, specialized favours, and credits!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner Role Picker Bar */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider text-purple-400 text-[11px]">Select Trade Partner:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {(['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'] as RoleGroup[])
                .filter(r => r !== currentRole)
                .map(r => {
                  const info = ROLE_GROUP_INFO[r];
                  const isSelected = partnerRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        sound.playClick();
                        setPartnerRole(r);
                        setRequestedCatalogItems([]);
                        setRequestedFavours([]);
                        setRequestedCredits(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 ring-2 ring-purple-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span>{info.icon}</span>
                      <span>{info.name.replace(' Department', '').replace(' Care', '')}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Options
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'items' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>Items</span>
            </button>
            <button
              onClick={() => setActiveTab('favours')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'favours' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Handshake className="w-3 h-3" />
              <span>Favours</span>
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'credits' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coins className="w-3 h-3 text-amber-400" />
              <span>Credits</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Trade Canvas */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* LEFT COLUMN: YOUR OFFER */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{senderRoleMeta.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{senderRoleMeta.name} (Your Offer)</h3>
                    <p className="text-[11px] text-slate-400">Select items, favours, and credits to offer</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 block">{totalOfferedValue} Cr</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Offer Value</span>
                </div>
              </div>

              {/* 1. Items Option */}
              {(activeTab === 'all' || activeTab === 'items') && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>Option 1: Items ({offeredInventoryItems.length} selected)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">From Inventory</span>
                  </div>

                  {playerInventory.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                      No items in inventory to offer.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {playerInventory.map(item => {
                        const isOffered = offeredInventoryItems.some(i => i.id === item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleToggleOfferedItem(item)}
                            className={`p-2 rounded-xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer ${
                              isOffered
                                ? 'bg-purple-900/60 border-purple-500 text-white'
                                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-base">{item.icon}</span>
                              <span className="font-semibold truncate">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">~35 Cr</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Favours Option */}
              {(activeTab === 'all' || activeTab === 'favours') && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Handshake className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Option 2: Favours ({offeredFavours.length} selected)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">{senderRoleMeta.name} Services</span>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {senderFavours.map(favour => {
                      const isOffered = offeredFavours.some(f => f.id === favour.id);
                      return (
                        <button
                          key={favour.id}
                          onClick={() => handleToggleOfferedFavour(favour)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer ${
                            isOffered
                              ? 'bg-indigo-900/60 border-indigo-500 text-white'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{favour.icon}</span>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{favour.title}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">{favour.description}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 shrink-0">
                            +{favour.creditValue} Cr
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Credits Option */}
              {(activeTab === 'all' || activeTab === 'credits') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Option 3: Credits ({offeredCredits} Cr Offered)</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">Bal: {state.nurseCredits ?? 500} Cr</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="range"
                        min={0}
                        max={state.nurseCredits ?? 500}
                        step={10}
                        value={offeredCredits}
                        onChange={(e) => setOfferedCredits(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                      <span className="font-mono text-sm font-extrabold text-amber-400 w-16 text-right">
                        {offeredCredits} Cr
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-bold">
                      <span className="text-slate-500">Presets:</span>
                      {[0, 25, 50, 100, 200, 500].map(amt => (
                        <button
                          key={amt}
                          onClick={() => {
                            sound.playClick();
                            setOfferedCredits(Math.min(amt, state.nurseCredits ?? 500));
                          }}
                          className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                            offeredCredits === amt
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          +{amt} Cr
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PARTNER REQUEST */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{partnerRoleMeta.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{partnerRoleMeta.name} (Your Request)</h3>
                    <p className="text-[11px] text-slate-400">Select items, favours, and credits to request</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 block">{totalRequestedValue} Cr</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Request Value</span>
                </div>
              </div>

              {/* 1. Partner Items Option */}
              {(activeTab === 'all' || activeTab === 'items') && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>Option 1: Items ({requestedCatalogItems.length} selected)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">{partnerRoleMeta.name} Stock</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {partnerCatalogItems.map(item => {
                      const isRequested = requestedCatalogItems.some(i => i.id === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleToggleRequestedItem(item)}
                          className={`p-2 rounded-xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer ${
                            isRequested
                              ? 'bg-emerald-900/60 border-emerald-500 text-white'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-base">{item.icon}</span>
                            <span className="font-semibold truncate">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">{item.creditValue} Cr</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Partner Favours Option */}
              {(activeTab === 'all' || activeTab === 'favours') && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Handshake className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Option 2: Favours ({requestedFavours.length} selected)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">{partnerRoleMeta.name} Services</span>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {partnerFavours.map(favour => {
                      const isRequested = requestedFavours.some(f => f.id === favour.id);
                      return (
                        <button
                          key={favour.id}
                          onClick={() => handleToggleRequestedFavour(favour)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer ${
                            isRequested
                              ? 'bg-emerald-900/60 border-emerald-500 text-white'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{favour.icon}</span>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{favour.title}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">{favour.description}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 shrink-0">
                            {favour.creditValue} Cr
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Partner Credits Option */}
              {(activeTab === 'all' || activeTab === 'credits') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Option 3: Credits ({requestedCredits} Cr Requested)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">From Department Budget</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="range"
                        min={0}
                        max={300}
                        step={10}
                        value={requestedCredits}
                        onChange={(e) => setRequestedCredits(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <span className="font-mono text-sm font-extrabold text-amber-400 w-16 text-right">
                        {requestedCredits} Cr
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-bold">
                      <span className="text-slate-500">Presets:</span>
                      {[0, 25, 50, 100, 150, 250].map(amt => (
                        <button
                          key={amt}
                          onClick={() => {
                            sound.playClick();
                            setRequestedCredits(amt);
                          }}
                          className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                            requestedCredits === amt
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          +{amt} Cr
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Deal Presets Bar */}
        <div className="px-5 py-2 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-purple-300">Quick Trade Presets:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => handleApplyPresetDeal('espresso')}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <span>☕</span>
              <span>50 Cr ➔ Cantina Espresso & Smoothie</span>
            </button>

            <button
              onClick={() => handleApplyPresetDeal('grant')}
              className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <span>🏢</span>
              <span>Favour Swap ➔ Director Wing Budget</span>
            </button>

            <button
              onClick={() => handleApplyPresetDeal('meds')}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <span>💊</span>
              <span>60 Cr ➔ Nurse Prescription Meds</span>
            </button>
          </div>
        </div>

        {/* Action & Meter Footer */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          
          {/* Meter */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-lg ${isAcceptable ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300' : 'bg-amber-950 border border-amber-500/50 text-amber-300'}`}>
              {isAcceptable ? '🤝' : '⚖️'}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Negotiation Status:</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                  isAcceptable ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                }`}>
                  {totalOfferedValue === 0 && totalRequestedValue === 0 ? 'Select Terms' : (isAcceptable ? 'Deal Accepted ✓' : 'Unbalanced Offer')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Offer Value: {totalOfferedValue} Cr | Request Value: {totalRequestedValue} Cr
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmTrade}
              disabled={!isAcceptable}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xl cursor-pointer ${
                isAcceptable
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/60 ring-2 ring-emerald-400/50 scale-102'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Handshake className="w-4 h-4" />
              <span>Execute Trade Contract</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
