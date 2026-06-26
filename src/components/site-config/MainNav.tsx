import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WebNavProfileMenu } from "@/components/layout/WebNavProfileMenu";
import { Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.id],
    queryFn: async () => {
      if (!session?.id) return null;

      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', session.id)
        .single();

      return data;
    },
    enabled: !!session?.id
  });

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${(profile.first_name?.[0] || '').toUpperCase()}${(profile.last_name?.[0] || '').toUpperCase()}`;
    }
    return session?.email?.[0]?.toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return session?.email?.split('@')[0] || '';
  };

  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/limitless-logo.svg"
                alt="Limitless Lab"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/product" className="text-gray-700 hover:text-[#393CA0]">Product</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#393CA0]">Services</Link>
            <Link to="/courses" className="text-gray-700 hover:text-[#393CA0]">Courses</Link>
            <Link to="/tools" className="text-gray-700 hover:text-[#393CA0]">Tools</Link>
            
            {/* Programs Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#393CA0] flex items-center">
                Programs
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/programs/limitlessgov" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  LimitlessGov
                </Link>
                <Link to="/programs/ai-ready-asean" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  AI Ready ASEAN
                </Link>
                <Link to="/programs/aim-asean" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  AIM ASEAN
                </Link>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#393CA0] flex items-center">
                About
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/about" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  About Us
                </Link>
                <Link to="/about/transformation-model" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  Our Transformation Model
                </Link>
                <Link to="/about/partner" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  Partner With Us
                </Link>
              </div>
            </div>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <WebNavProfileMenu
                avatarUrl={profile?.avatar_url || getDefaultAvatar()}
                initials={getInitials()}
                displayName={getDisplayName()}
              />
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-gray-700 hover:text-[#393CA0]">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <img
                      src="/limitless-logo.svg"
                      alt="Limitless Lab"
                      className="h-8 w-auto"
                    />
                  </div>
                  
                  <nav className="flex-1 overflow-y-auto py-4">
                    <Link 
                      to="/product" 
                      onClick={closeMenu}
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium"
                    >
                      Product
                    </Link>
                    <Link 
                      to="/services" 
                      onClick={closeMenu}
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium"
                    >
                      Services
                    </Link>
                    <Link 
                      to="/courses" 
                      onClick={closeMenu}
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium"
                    >
                      Courses
                    </Link>
                    <Link 
                      to="/tools" 
                      onClick={closeMenu}
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium"
                    >
                      Tools
                    </Link>
                    
                    {/* Mobile Programs Collapsible */}
                    <Collapsible open={programsOpen} onOpenChange={setProgramsOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium">
                        Programs
                        <ChevronDown className={`h-4 w-4 transition-transform ${programsOpen ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="bg-gray-50">
                        <Link 
                          to="/programs/limitlessgov" 
                          onClick={closeMenu}
                          className="block px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                        >
                          LimitlessGov
                        </Link>
                        <Link 
                          to="/programs/ai-ready-asean" 
                          onClick={closeMenu}
                          className="block px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                        >
                          AI Ready ASEAN
                        </Link>
                        <Link 
                          to="/programs/aim-asean" 
                          onClick={closeMenu}
                          className="block px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                        >
                          AIM ASEAN
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Mobile About Collapsible */}
                    <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium">
                        About
                        <ChevronDown className={`h-4 w-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="bg-gray-50">
                        <Link
                          to="/about"
                          onClick={closeMenu}
                          className="block px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                        >
                          About Us
                        </Link>
                        <Link
                          to="/about/transformation-model"
                          onClick={closeMenu}
                          className="block px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                        >
                          Our Transformation Model
                        </Link>
                        <Link
                          to="/about/partner"
                          onClick={closeMenu}
                          className="block px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                        >
                          Partner With Us
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>
                  </nav>
                  
                  {/* Mobile Auth Buttons */}
                  <div className="p-4 border-t border-gray-200">
                    {session ? (
                      <div className="flex items-center space-x-3">
                        <WebNavProfileMenu
                          avatarUrl={profile?.avatar_url || getDefaultAvatar()}
                          initials={getInitials()}
                          displayName={getDisplayName()}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link to="/signin" onClick={closeMenu}>
                          <Button variant="outline" className="w-full">Log in</Button>
                        </Link>
                        <Link to="/signup" onClick={closeMenu}>
                          <Button className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90">Sign up</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}