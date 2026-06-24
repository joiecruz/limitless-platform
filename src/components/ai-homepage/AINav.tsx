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

const BRAND = "#393CA0";
const ACCENT_GOLD = "#F59E0B";
const ACCENT_PINK = "#EC4899";

function AboutUsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="13" r="4.5" stroke={BRAND} strokeWidth="1.75" />
      <circle cx="21" cy="13" r="4.5" stroke={BRAND} strokeWidth="1.75" />
      <circle cx="16" cy="21" r="4.5" stroke={BRAND} strokeWidth="1.75" />
      <circle cx="24.5" cy="8.5" r="1.75" fill={ACCENT_GOLD} />
    </svg>
  );
}

function TransformationIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 16c0-4 3-7 7-7 3 0 5 2 6.5 4.5S22 18 25 18s5-2 5-5"
        stroke={BRAND}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M26 16c0 4-3 7-7 7-3 0-5-2-6.5-4.5S10 14 7 14s-5 2-5 5"
        stroke={BRAND}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="1.75" fill={ACCENT_PINK} />
    </svg>
  );
}

function PartnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 10v8a4 4 0 0 0 4 4h3"
        stroke={BRAND}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M26 22v-8a4 4 0 0 0-4-4h-3"
        stroke={BRAND}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.25" fill={ACCENT_GOLD} />
    </svg>
  );
}

const whyItems = [
  {
    title: "About Us",
    description: "Our story, mission, and the team behind Limitless Lab",
    Icon: AboutUsIcon,
    href: "#",
  },
  {
    title: "Our Transformation Model",
    description: "The human-centered AI framework that drives lasting change",
    Icon: TransformationIcon,
    href: "#",
  },
  {
    title: "Partner with Limitless Lab",
    description: "Collaborate with us to scale impact across your organization",
    Icon: PartnerIcon,
    href: "#",
  },
];

function EntrepreneurIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4c4 3 6 7 6 11a6 6 0 0 1-12 0c0-4 2-8 6-11z" stroke={BRAND} strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M11 22l-3 5 5-2M21 22l3 5-5-2" stroke={BRAND} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="14" r="2" fill={ACCENT_GOLD} />
    </svg>
  );
}

function CorporateIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="9" width="14" height="16" rx="2" stroke={BRAND} strokeWidth="1.75" />
      <rect x="13" y="5" width="14" height="16" rx="2" stroke={BRAND} strokeWidth="1.75" />
      <circle cx="24" cy="24" r="2" fill={ACCENT_PINK} />
    </svg>
  );
}

function GovernmentIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13l11-7 11 7" stroke={BRAND} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13v10M14 13v10M18 13v10M24 13v10" stroke={BRAND} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M4 26h24" stroke={BRAND} strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="16" cy="4" r="1.75" fill={ACCENT_GOLD} />
    </svg>
  );
}

function EducatorIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11l13-5 13 5-13 5-13-5z" stroke={BRAND} strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 14v6c0 2 4 4 8 4s8-2 8-4v-6" stroke={BRAND} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M29 11v7" stroke={BRAND} strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="29" cy="20" r="1.75" fill={ACCENT_PINK} />
    </svg>
  );
}

const whoItems = [
  {
    title: "Entrepreneurs & Business Owners",
    description: "Grow your venture with human-centered AI",
    Icon: EntrepreneurIcon,
    href: "/entrepreneurs",
  },
  {
    title: "Corporate Teams & Professionals",
    description: "Lead innovation and upskill your teams",
    Icon: CorporateIcon,
    href: "/corporates",
  },
  {
    title: "Public Servants & Government Leaders",
    description: "Deliver better services with AI-powered design",
    Icon: GovernmentIcon,
    href: "/government",
  },
  {
    title: "Educators & Students",
    description: "Learn, teach, and build the future of work",
    Icon: EducatorIcon,
    href: "/schools",
  },
];

export function AINav() {
  const [isOpen, setIsOpen] = useState(false);
  const [whyOpenMobile, setWhyOpenMobile] = useState(false);
  const [whoOpenMobile, setWhoOpenMobile] = useState(false);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.id],
    queryFn: async () => {
      if (!session?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", session.id)
        .single();
      return data;
    },
    enabled: !!session?.id,
  });

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${(profile.first_name?.[0] || "").toUpperCase()}${(profile.last_name?.[0] || "").toUpperCase()}`;
    }
    return session?.email?.[0]?.toUpperCase() || "?";
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return session?.email?.split("@")[0] || "";
  };

  const getDefaultAvatar = () =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/ai-homepage">
              <img src="/limitless-logo.svg" alt="Limitless Lab" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Why Limitless Lab mega-menu */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#393CA0] flex items-center py-6">
                Why Limitless Lab
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
                <div className="grid grid-cols-3 gap-4">
                  {whyItems.map(({ title, description, Icon, href }) => (
                    <a
                      key={title}
                      href={href}
                      className="flex flex-col gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group/item"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#393CA0]/10 flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover/item:text-[#393CA0]">
                          {title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 leading-snug">
                          {description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Who We Help mega-menu */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#393CA0] flex items-center py-6">
                Who We Help
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {whoItems.map(({ title, description, Icon, href }) => (
                    <Link
                      key={title}
                      to={href}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group/item"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#393CA0]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover/item:text-[#393CA0] leading-tight">
                          {title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 leading-snug">
                          {description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-[#393CA0]">Solutions</a>
            <a href="#" className="text-gray-700 hover:text-[#393CA0]">Programs</a>
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
                <Link to="/ai-assessment">
                  <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                    Take Free AI Assessment
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
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
                    <img src="/limitless-logo.svg" alt="Limitless Lab" className="h-8 w-auto" />
                  </div>

                  <nav className="flex-1 overflow-y-auto py-4">
                    {/* Why Limitless Lab collapsible */}
                    <Collapsible open={whyOpenMobile} onOpenChange={setWhyOpenMobile}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium">
                        Why Limitless Lab
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${whyOpenMobile ? "rotate-180" : ""}`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="bg-gray-50">
                        {whyItems.map(({ title, Icon, href }) => (
                          <a
                            key={title}
                            href={href}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                          >
                            <div className="w-8 h-8 rounded-md bg-[#393CA0]/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span>{title}</span>
                          </a>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Who We Help collapsible */}
                    <Collapsible open={whoOpenMobile} onOpenChange={setWhoOpenMobile}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium">
                        Who We Help
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${whoOpenMobile ? "rotate-180" : ""}`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="bg-gray-50">
                        {whoItems.map(({ title, Icon, href }) => (
                          <Link
                            key={title}
                            to={href}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-8 py-3 text-gray-600 hover:text-[#393CA0]"
                          >
                            <div className="w-8 h-8 rounded-md bg-[#393CA0]/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm">{title}</span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                    <a href="#" onClick={closeMenu} className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium">Solutions</a>
                    <a href="#" onClick={closeMenu} className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#393CA0] font-medium">Programs</a>
                  </nav>

                  <div className="p-4 border-t border-gray-200">
                    {session ? (
                      <WebNavProfileMenu
                        avatarUrl={profile?.avatar_url || getDefaultAvatar()}
                        initials={getInitials()}
                        displayName={getDisplayName()}
                      />
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link to="/signin" onClick={closeMenu}>
                          <Button variant="outline" className="w-full">Log in</Button>
                        </Link>
                        <Link to="/ai-assessment" onClick={closeMenu}>
                          <Button className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90">
                            Take Free AI Assessment
                          </Button>
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
