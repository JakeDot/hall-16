import React from 'react';
import { Item } from '../types/game';
import { X, Info, Package, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface InventoryDrawerProps {
  inventory: Item[];
  onClose: () => void;
  onInspectItem: (item: Item) => void;
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  inventory,
  onClose,
  onInspectItem
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base text-white">Hospital Item Bag & Gear</h3>
          </div>

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

        {/* Item List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {inventory.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">Your inventory is empty.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {inventory.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onInspectItem(item);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-purple-300 shrink-0">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
