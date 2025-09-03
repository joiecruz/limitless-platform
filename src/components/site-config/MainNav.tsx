import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WebNavProfileMenu } from "@/components/layout/WebNavProfileMenu";

export function MainNav() {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/limitless-logo.svg"
                alt="Limitless Lab"
                className="h-10 w-auto" // Increased from h-8 to h-10
              />
            </Link>
          </div>
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
                <Link to="/programs/asean-digital-literacy" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0]">
                  ASEAN Digital Literacy Programme
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
  );
}