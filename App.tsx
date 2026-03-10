
import React, { useState, useMemo, useCallback } from 'react';
import { Page, Offer, CartItem } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OfferSelectionPage from './pages/OfferSelectionPage';
import CartSidebar from './components/CartSidebar';
import InquiryModal from './components/InquiryModal';
import CreateInquiryPage from './pages/CreateInquiryPage';
import RFQProcessingPage from './pages/RFQProcessingPage';
import QuotationPage from './pages/QuotationPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.OfferSelection);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedForInquiry, setSelectedForInquiry] = useState<string[]>([]);

  const addToCart = useCallback((offer: Offer) => {
    setCart(prev => {
      const existing = prev.find(item => item.offer.id === offer.id);
      if (existing) {
        return prev.map(item => 
          item.offer.id === offer.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { offer, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((offerId: string) => {
    setCart(prev => prev.filter(item => item.offer.id !== offerId));
  }, []);

  const updateQuantity = useCallback((offerId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.offer.id === offerId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, curr) => acc + curr.quantity, 0), [cart]);
  
  const hasPartnerOffers = useMemo(() => 
    cart.some(item => item.offer.type === 'partner'), 
  [cart]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (hasPartnerOffers) {
      setIsInquiryModalOpen(true);
    } else {
      alert('Proceeding to standard checkout...');
    }
  };

  const handleCreateInquiry = (selectedIds: string[]) => {
    setSelectedForInquiry(selectedIds);
    setIsInquiryModalOpen(false);
    setCurrentPage(Page.CreateInquiry);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.OfferSelection:
        return (
          <div className="flex h-screen overflow-hidden relative">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
              <Header 
                cartCount={cartCount} 
                onOpenCart={() => setIsCartOpen(true)} 
                onNavigateHome={() => setCurrentPage(Page.OfferSelection)}
              />
              <div className="flex-1 overflow-y-auto min-h-0">
                <OfferSelectionPage onAddToCart={addToCart} />
              </div>
            </main>
          </div>
        );
      case Page.CreateInquiry:
        return (
          <CreateInquiryPage 
            selectedOffers={cart.filter(item => selectedForInquiry.includes(item.offer.id))}
            onCancel={() => setCurrentPage(Page.OfferSelection)}
            onSubmit={() => setCurrentPage(Page.Quotation)}
          />
        );
      case Page.Quotation:
        return (
          <div className="h-screen w-screen bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Sidebar and Header removed for full-width workspace experience */}
            <QuotationPage selectedOffers={cart} onExit={() => setCurrentPage(Page.OfferSelection)} />
          </div>
        );
      case Page.RFQProcessing:
        return (
          <div className="flex h-screen overflow-hidden relative">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
              <Header 
                cartCount={cartCount} 
                onOpenCart={() => setIsCartOpen(true)} 
                onNavigateHome={() => setCurrentPage(Page.OfferSelection)}
              />
              <div className="flex-1 overflow-y-auto min-h-0">
                <RFQProcessingPage />
              </div>
            </main>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative">
      {renderContent()}

      {/* Overlays for Cart Selection flow */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
        hasPartnerOffers={hasPartnerOffers}
      />

      {isInquiryModalOpen && (
        <InquiryModal 
          cart={cart.filter(item => item.offer.type === 'partner')}
          onClose={() => setIsInquiryModalOpen(false)}
          onConfirm={handleCreateInquiry}
        />
      )}
    </div>
  );
};

export default App;
