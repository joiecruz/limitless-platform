import { useState, useEffect } from "react";

interface Logo {
  id: string;
  name: string;
  image_url: string;
}

const staticLogos: Logo[] = [
  {
    id: "1",
    name: "USAID",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%201.svg"
  },
  {
    id: "2",
    name: "US Embassy",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%202.svg"
  },
  {
    id: "3",
    name: "ASEAN Foundation",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%203.svg"
  },
  {
    id: "4",
    name: "The Asia Foundation",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%204.svg"
  },
  {
    id: "5",
    name: "DICT",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%205.svg"
  },
  {
    id: "6",
    name: "UNDP",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%206.svg"
  },
  {
    id: "7",
    name: "ADB",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%207.svg"
  },
  {
    id: "8",
    name: "Bloomberg Philantrophies",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%208.svg"
  },
  {
    id: "9",
    name: "DTI",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%209.svg"
  },
  {
    id: "10",
    name: "Plan International",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2010.svg"
  },
  {
    id: "11",
    name: "Department of Health",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2011.svg"
  },
  {
    id: "13",
    name: "PDRF",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2013.svg"
  },
  {
    id: "14",
    name: "Smart",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2014.svg"
  },
  {
    id: "15",
    name: "Department of Agriculture",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2015.svg"
  },
  {
    id: "16",
    name: "DILG",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2016.svg"
  },
  {
    id: "17",
    name: "ABS-CBN Foundation",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2017.svg"
  },
  {
    id: "18",
    name: "University of the Philippines",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2018.svg"
  },
  {
    id: "19",
    name: "PhilDev",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2019.svg"
  },
  {
    id: "20",
    name: "Tatler Gen T List",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2020.svg"
  },
  {
    id: "21",
    name: "Carelon",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2021.svg"
  },
  {
    id: "22",
    name: "SEARCA",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2022.svg"
  },
  {
    id: "23",
    name: "DOST",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2023.svg"
  },
  {
    id: "24",
    name: "PNB",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2024.svg"
  },
  {
    id: "25",
    name: "QBO",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2025.svg"
  },
  {
    id: "26",
    name: "Gokongwei Brothers Foundation",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2026.svg"
  },
  {
    id: "27",
    name: "Educo",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2027.svg"
  },
  {
    id: "28",
    name: "DepEd",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2028.svg"
  },
  {
    id: "29",
    name: "Pasig City",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2029.svg"
  },
  {
    id: "30",
    name: "Department of Finance",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2030.svg"
  },
  {
    id: "31",
    name: "FWD",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2031.svg"
  },
  {
    id: "32",
    name: "Suy Sing",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2032.svg"
  },
  {
    id: "33",
    name: "NZTE",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2033.svg"
  },
  {
    id: "34",
    name: "NEDA",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2034.svg"
  },
  {
    id: "35",
    name: "Microsoft",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2035.svg"
  },
  {
    id: "36",
    name: "Google.org",
    image_url: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/client_logos/image%2036.svg"
  }
];

export function InfiniteLogos({ direction = "left" }: { direction?: "left" | "right" }) {
  const [logos, setLogos] = useState<Logo[]>(staticLogos);

  // Double the logos array to create seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative flex overflow-hidden py-4 bg-background">
      <div
        className={`flex animate-scroll-${direction} items-center`}
        style={{
          animationDuration: "30s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
          width: "fit-content",
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="mx-8 flex items-center justify-center"
          >
            <img
              src={logo.image_url}
              alt={logo.name}
              className="h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}